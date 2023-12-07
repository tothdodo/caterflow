using Caterflow.BLL.DTOs.IngredientDTOs;
using Caterflow.BLL.DTOs.OrderDTOs;
using CaterFlow.DAL;
using CaterFlow.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TicketingSystemBLL.HubConfig;

namespace Caterflow.BLL.Services.OrderService
{
    public class OrderService : IOrderService
    {
        private readonly CaterFlowDbContext _dbContext;

        private readonly IHubContext<SubOrderHub> _hub;
        public OrderService(CaterFlowDbContext dbContext, IHubContext<SubOrderHub> hub)
        {
            _dbContext = dbContext;
            _hub = hub;
        }

        public async Task<OrderDTO> AddSubOrder(CreateSubOrder subOrder)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.CateringUnitUsers)
                .Include(cu => cu.Products).ThenInclude(p => p.Ingredients)
                .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders).ThenInclude(so => so.SubOrderItems).ThenInclude(soi => soi.Product)
                .Include(cu => cu.Orders).ThenInclude(o => o.Table)
                .FirstOrDefaultAsync(cu => cu.Id == subOrder.CateringUnitId)
                ?? throw new ArgumentException($"Catering unit with id {subOrder.CateringUnitId} not found.");
            var dbOrder = dbUnit.Orders.FirstOrDefault(o => o.Id == subOrder.OrderId)
                ?? throw new ArgumentException($"Order with id {subOrder.OrderId} not found.");

            var user = dbUnit.CateringUnitUsers.FirstOrDefault(u => u.UserId == subOrder.UserId)
                ?? throw new ArgumentException($"User with id {subOrder.UserId} not found.");

            var dbSubOrder = new SubOrder
            {
                Date = DateTime.Now,
                OrderId = dbOrder.Id,
                DiningOption = subOrder.DiningOption,
                WaiterName = user.NickName,
            };

            bool containsDrink = false;
            bool containsFood = false;

            foreach (var subOrderItem in subOrder.SubOrderItems)
            {
                var dbProduct = dbUnit.Products.FirstOrDefault(p => p.Id == subOrderItem.Product.Id)
                    ?? throw new ArgumentException($"Product with id {subOrderItem.Product.Id} not found.");

                if (!containsDrink)
                {
                    if (dbProduct.CreationPlace == ProductCreationPlace.Drink)
                    {
                        containsDrink = true;
                    }
                }
                if (!containsFood)
                {
                    if (dbProduct.CreationPlace == ProductCreationPlace.Kitchen)
                    {
                        containsFood = true;
                    }
                }

                var newDbProduct = new ProductOrder
                {
                    Name = dbProduct.Name,
                    Price = dbProduct.Price + subOrderItem.Product.Ingredients
                        .Where(i => i.ContainType == ContainType.Plus)
                        .Sum(i => i.PlusPrice),
                    CategoryId = dbProduct.CategoryId,
                    ProductId = dbProduct.Id,
                    CreationPlace = dbProduct.CreationPlace
                };

                foreach (var ingredient in subOrderItem.Product.Ingredients)
                {
                    var dbIngredient = dbProduct.Ingredients.FirstOrDefault(i => i.Id == ingredient.Id)
                        ?? throw new ArgumentException($"Ingredient with id {ingredient.Id} not found.");

                    var newDbIngredient = new IngredientProductOrder
                    {
                        Name = dbIngredient.Name,
                        PlusPrice = ingredient.PlusPrice,
                        ContainType = ingredient.ContainType
                    };
                    newDbProduct.Ingredients.Add(newDbIngredient);
                }

                var dbSubOrderItem = new SubOrderItem
                {
                    Amount = subOrderItem.Amount,
                    AmountToPay = subOrderItem.Amount,
                    Price = subOrderItem.Amount * newDbProduct.Price,
                    Product = newDbProduct,
                    SubOrderId = dbSubOrder.Id
                };
                dbSubOrder.SubOrderItems.Add(dbSubOrderItem);
            }

            dbSubOrder.KitchenStatus = containsFood ? SubOrderStatus.InProgress : SubOrderStatus.Ready;
            dbSubOrder.DrinkStatus = containsDrink ? SubOrderStatus.InProgress : SubOrderStatus.Ready;

            dbOrder.SubOrders.Add(dbSubOrder);

            dbOrder.Status = OrderStatus.InProgress;

            await _dbContext.SaveChangesAsync();

            var drinkSubOrderDTO = new SubOrderDTO
            {
                Id = dbSubOrder.Id,
                Date = dbSubOrder.Date,
                DrinkStatus = dbSubOrder.DrinkStatus,
                KitchenStatus = dbSubOrder.KitchenStatus,
                DiningOption = dbSubOrder.DiningOption,
                WaiterName = dbSubOrder.WaiterName,
                SubOrderItems = dbSubOrder.SubOrderItems
                    .Where(soi => soi.Product.CreationPlace != ProductCreationPlace.Kitchen)
                    .Select(soi => new SubOrderItemDTO
                    {
                        Id = soi.Id,
                        Amount = soi.Amount,
                        Product = new SubOrderItemProduct
                        {
                            Id = soi.Product.Id,
                            Name = soi.Product.Name,
                            Price = soi.Product.Price,
                            ProductId = soi.Product.ProductId,
                        }
                    }).ToList()
            };

            var kitchenSubOrderDTO = new SubOrderDTO
            {
                Id = dbSubOrder.Id,
                Date = dbSubOrder.Date,
                DrinkStatus = dbSubOrder.DrinkStatus,
                KitchenStatus = dbSubOrder.KitchenStatus,
                DiningOption = dbSubOrder.DiningOption,
                WaiterName = dbSubOrder.WaiterName,
                SubOrderItems = dbSubOrder.SubOrderItems
                    .Where(soi => soi.Product.CreationPlace == ProductCreationPlace.Kitchen)
                    .Select(soi => new SubOrderItemDTO
                    {
                        Id = soi.Id,
                        Amount = soi.Amount,
                        Product = new SubOrderItemProduct
                        {
                            Id = soi.Product.Id,
                            Name = soi.Product.Name,
                            Price = soi.Product.Price,
                            ProductId = soi.Product.ProductId,
                            Ingredients = soi.Product.Ingredients.Select(i => new IngredientDTO
                            {
                                Id = i.Id,
                                Name = i.Name,
                                PlusPrice = i.PlusPrice,
                                ContainType = i.ContainType
                            }).ToList()
                        }
                    }).ToList()
            };

            if (drinkSubOrderDTO.SubOrderItems.Count > 0)
            {
                await _hub.Clients.Group("Drink" + dbUnit.Id.ToString()).SendAsync("ReceiveDrinkSubOrder", drinkSubOrderDTO);
            }
            if (kitchenSubOrderDTO.SubOrderItems.Count > 0)
            {
                await _hub.Clients.Group("Kitchen" + dbUnit.Id.ToString()).SendAsync("ReceiveKitchenSubOrder", kitchenSubOrderDTO);
            }

            var orderDTO = new OrderDTO
            {
                Id = dbOrder.Id,
                TableNumber = dbOrder.Table?.Number,
                Status = dbOrder.Status,
                FullPrice = dbOrder.SubOrders.Sum(so => so.SubOrderItems.Sum(soi => soi.Price)),
                SubOrders = dbOrder.SubOrders.Select(oi => new SubOrderDTO
                {
                    Id = oi.Id,
                    Date = oi.Date,
                    DrinkStatus = oi.DrinkStatus,
                    KitchenStatus = oi.KitchenStatus,
                    DiningOption = oi.DiningOption,
                    SubOrderItems = oi.SubOrderItems.Select(soi => new SubOrderItemDTO
                    {
                        Id = soi.Id,
                        Amount = soi.Amount,
                        AmountToPay = soi.AmountToPay,
                        Product = new SubOrderItemProduct
                        {
                            Id = soi.Product.Id,
                            Name = soi.Product.Name,
                            Price = soi.Product.Price,
                            ProductId = soi.Product.ProductId,
                            Ingredients = soi.Product.Ingredients.Select(i => new IngredientDTO
                            {
                                Id = i.Id,
                                Name = i.Name,
                                PlusPrice = i.PlusPrice,
                                ContainType = i.ContainType
                            }).ToList()
                        }
                    }).ToList()
                }).ToList()
            };
            return orderDTO;
        }

        public async Task<OrderDTO> CreateOrder(CreateOrder order)
        {
            var dbUnit = await _dbContext.CateringUnits.Include(cu => cu.Orders).Include(cu => cu.Tables).FirstOrDefaultAsync(cu => cu.Id == order.CateringUnitId)
                ?? throw new ArgumentException($"Catering unit with id {order.CateringUnitId} not found.");

            if (order.TableNumber.HasValue && !dbUnit.Tables.Any(t => t.Number == order.TableNumber.Value))
            {
                throw new ArgumentException($"Table with number {order.TableNumber.Value} not found.");
            }
            var dbTable = order.TableNumber.HasValue ? dbUnit.Tables.FirstOrDefault(t => t.Number == order.TableNumber.Value) : null;
            var dbOrder = new Order
            {
                Table = dbTable,
                Status = OrderStatus.InProgress,
                Date = DateTime.Now,
            };
            dbUnit.Orders.Add(dbOrder);
            await _dbContext.SaveChangesAsync();
            return new OrderDTO
            {
                Id = dbOrder.Id,
                TableNumber = dbOrder.Table?.Number,
                Status = dbOrder.Status
            };
        }

        public async Task<ActiveOrders> GetActiveOrders(int cateringUnitId, string waiterName)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders)
                .Include(cu => cu.Orders).ThenInclude(o => o.Table)
                .FirstOrDefaultAsync(cu => cu.Id == cateringUnitId)
                ?? throw new ArgumentException($"Catering unit with id {cateringUnitId} not found.");

            var ordersWithWaiterSubOrder = dbUnit.Orders
                .Where(o => o.SubOrders.Any(so => so.WaiterName == waiterName) && (o.Status != OrderStatus.Served))
                .Select(o => new OrderHeader
                {
                    Id = o.Id,
                    TableNumber = o.Table?.Number,
                    Date = o.Date,
                }).ToList();

            var ordersWithoutWaiterSubOrder = dbUnit.Orders
                .Where(o => !o.SubOrders.Any(so => so.WaiterName == waiterName) && (o.Status != OrderStatus.Served))
                .Select(o => new OrderHeader
                {
                    Id = o.Id,
                    TableNumber = o.Table?.Number,
                    Date = o.Date,
                }).ToList();

            var activeOrders = new ActiveOrders 
            {
                WaiterOrders = ordersWithWaiterSubOrder,
                OtherOrders = ordersWithoutWaiterSubOrder
            };

            return activeOrders;
        }

        public async Task<OrderDTO?> GetOrderByIds(GetOrder order)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders).ThenInclude(so => so.SubOrderItems).ThenInclude(soi => soi.Product).ThenInclude(p => p.Ingredients)
                .Include(cu => cu.Orders).ThenInclude(o => o.Table)
                .FirstOrDefaultAsync(cu => cu.Id == order.CateringUnitId) ?? throw new ArgumentException($"Catering unit with id {order.CateringUnitId} not found.");

            var dbOrder = dbUnit.Orders.FirstOrDefault(o => o.Id == order.OrderId);
            if (dbOrder == null)
            {
                return null;
            }
            var orderDTO = new OrderDTO
            {
                Id = dbOrder.Id,
                TableNumber = dbOrder.Table?.Number,
                Status = dbOrder.Status,
                FullPrice = dbOrder.SubOrders.Sum(so => so.SubOrderItems.Sum(soi => soi.Product.Price * soi.Amount)),
                SubOrders = dbOrder.SubOrders.Select(oi => new SubOrderDTO
                {
                    Id = oi.Id,
                    Date = oi.Date,
                    DiningOption = oi.DiningOption,
                    DrinkStatus = oi.DrinkStatus,
                    KitchenStatus = oi.KitchenStatus,
                    SubOrderItems = oi.SubOrderItems.Select(soi => new SubOrderItemDTO
                    {
                        Id = soi.Id,
                        Amount = soi.Amount,
                        AmountToPay = soi.AmountToPay,
                        Product = new SubOrderItemProduct
                        {
                            Id = soi.Product.Id,
                            Name = soi.Product.Name,
                            Price = soi.Product.Price,
                            ProductId = soi.Product.ProductId,
                            Ingredients = soi.Product.Ingredients.Select(i => new IngredientDTO
                            {
                                Id = i.Id,
                                Name = i.Name,
                                PlusPrice = i.PlusPrice,
                                ContainType = i.ContainType
                            }).ToList()
                        }
                    }).ToList()
                }).ToList()
            };
            return orderDTO;
        }

        public async Task<OrderDTO> ModifySubOrder(ModifySubOrder subOrder)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders).ThenInclude(so => so.SubOrderItems).ThenInclude(soi => soi.Product)
                .Include(cu => cu.Products)
                .FirstOrDefaultAsync(cu => cu.Id == subOrder.CateringUnitId)
                ?? throw new ArgumentException($"Catering unit with id {subOrder.CateringUnitId} not found.");

            var dbOrder = dbUnit.Orders.FirstOrDefault(o => o.Id == subOrder.OrderId)
                ?? throw new ArgumentException($"Order with id {subOrder.OrderId} not found.");

            var dbSubOrder = dbOrder.SubOrders.FirstOrDefault(so => so.Id == subOrder.Id)
                ?? throw new ArgumentException($"SubOrder with id {subOrder.Id} not found.");

            bool containsDrink = false;
            bool containsFood = false;

            foreach (var dbSubOrderItem in dbSubOrder.SubOrderItems)
            {
                var modifySubOrderItem = subOrder.SubOrderItems.FirstOrDefault(soi => soi.Id == dbSubOrderItem.Id)
                    ?? throw new ArgumentException($"SubOrderItem with id {dbSubOrderItem.Id} not found.");

                if (modifySubOrderItem.Amount == 0)
                {
                    dbSubOrder.SubOrderItems.Remove(dbSubOrderItem);
                    continue;
                }
                var difference = modifySubOrderItem.Amount - dbSubOrderItem.Amount;
                dbSubOrderItem.Amount = modifySubOrderItem.Amount;
                dbSubOrderItem.AmountToPay += difference;

                var dbProduct = dbUnit.Products.FirstOrDefault(p => p.Id == dbSubOrderItem.Product.ProductId)
                    ?? throw new ArgumentException($"Product with id {dbSubOrderItem.Product.ProductId} not found.");

                if (!containsDrink)
                {
                    if (dbProduct.CreationPlace == ProductCreationPlace.Drink)
                    {
                        containsDrink = true;
                    }
                }
                if (!containsFood)
                {
                    if (dbProduct.CreationPlace == ProductCreationPlace.Kitchen)
                    {
                        containsFood = true;
                    }
                }
            }

            dbSubOrder.KitchenStatus = containsFood ? SubOrderStatus.InProgress : SubOrderStatus.Ready;
            dbSubOrder.DrinkStatus = containsDrink ? SubOrderStatus.InProgress : SubOrderStatus.Ready;

            if (dbSubOrder.SubOrderItems.Count == 0)
            {
                dbOrder.SubOrders.Remove(dbSubOrder);
            }

            await _dbContext.SaveChangesAsync();

            var orderDTO = new OrderDTO
            {
                Id = dbOrder.Id,
                TableNumber = dbOrder.Table?.Number,
                Status = dbOrder.Status,
                FullPrice = dbOrder.SubOrders.Sum(so => so.SubOrderItems.Sum(soi => soi.Price)),
                SubOrders = dbOrder.SubOrders.Select(oi => new SubOrderDTO
                {
                    Id = oi.Id,
                    Date = oi.Date,
                    DrinkStatus = oi.DrinkStatus,
                    KitchenStatus = oi.KitchenStatus,
                    SubOrderItems = oi.SubOrderItems.Select(soi => new SubOrderItemDTO
                    {
                        Id = soi.Id,
                        Amount = soi.Amount,
                        AmountToPay = soi.AmountToPay,
                        Product = new SubOrderItemProduct
                        {
                            Id = soi.Product.Id,
                            Name = soi.Product.Name,
                            Price = soi.Product.Price
                        }
                    }).ToList()
                }).ToList()
            };
            return orderDTO;
        }

        public async Task<SubOrderDTO> UpdateSubOrderState(UpdateSubOrderState updateState)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders).ThenInclude(so => so.SubOrderItems).ThenInclude(soi => soi.Product)
                .Include(cu => cu.Orders).ThenInclude(o => o.Table)
                .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders)
                .FirstOrDefaultAsync(cu => cu.Id == updateState.CateringUnitId)
                ?? throw new ArgumentException($"Catering unit with id {updateState.CateringUnitId} not found.");

            var dbSubOrder = dbUnit.Orders
                .SelectMany(o => o.SubOrders)
                .FirstOrDefault(so => so.Id == updateState.SubOrderId)
                ?? throw new ArgumentException($"SubOrder with id {updateState.SubOrderId} not found.");

            if (updateState.CreationPlace == ProductCreationPlace.Kitchen)
            {
                dbSubOrder.KitchenStatus = updateState.NewStatus;
            }
            else
            {
                dbSubOrder.DrinkStatus = updateState.NewStatus;
            }

            await _dbContext.SaveChangesAsync();

            var allSubOrdersReady = dbSubOrder.Order.SubOrders
                .All(so => so.KitchenStatus == SubOrderStatus.Ready && so.DrinkStatus == SubOrderStatus.Ready);

            if (allSubOrdersReady)
            {
                dbSubOrder.Order.Status = OrderStatus.Ready;
                await _dbContext.SaveChangesAsync();
            }

            return new SubOrderDTO
            {
                Id = dbSubOrder.Id,
                Date = dbSubOrder.Date,
                DiningOption = dbSubOrder.DiningOption,
                DrinkStatus = dbSubOrder.DrinkStatus,
                KitchenStatus = dbSubOrder.KitchenStatus,
                SubOrderItems = dbSubOrder.SubOrderItems.Select(soi => new SubOrderItemDTO
                {
                    Id = soi.Id,
                    Amount = soi.Amount,
                    AmountToPay = soi.AmountToPay,
                    Product = new SubOrderItemProduct
                    {
                        Id = soi.Product.Id,
                        Name = soi.Product.Name,
                        Price = soi.Product.Price,
                        ProductId = soi.Product.ProductId,
                    }
                }).ToList()
            };
        }

        public async Task<bool> SetOrderServed(GetOrder getOrder)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders)
                .FirstOrDefaultAsync(cu => cu.Id == getOrder.CateringUnitId)
                ?? throw new ArgumentException($"Catering unit with id {getOrder.CateringUnitId} not found.");

            var dbOrder = dbUnit.Orders.FirstOrDefault(o => o.Id == getOrder.OrderId)
                ?? throw new ArgumentException($"Order with id {getOrder.OrderId} not found.");

            dbOrder.Status = OrderStatus.Served;

            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<List<SubOrderDTO>> GetActiveSubOrders(int cateringUnitId, ProductCreationPlace place)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders).ThenInclude(so => so.SubOrderItems).ThenInclude(soi => soi.Product).ThenInclude(p => p.Ingredients)
                .Include(cu => cu.Orders).ThenInclude(o => o.Table)
                .FirstOrDefaultAsync(cu => cu.Id == cateringUnitId) ?? throw new ArgumentException($"Catering unit with id {cateringUnitId} not found.");

            var activeSubOrders = dbUnit.Orders
                .SelectMany(o => o.SubOrders)
                .Where(so => (so.KitchenStatus == SubOrderStatus.InProgress && place == ProductCreationPlace.Kitchen) || (so.DrinkStatus == SubOrderStatus.InProgress && place == ProductCreationPlace.Drink))
                .Select(so => new SubOrderDTO
                {
                    Id = so.Id,
                    Date = so.Date,
                    DiningOption = so.DiningOption,
                    DrinkStatus = so.DrinkStatus,
                    KitchenStatus = so.KitchenStatus,
                    WaiterName = so.WaiterName,
                    SubOrderItems = so.SubOrderItems
                        .Where(soi => soi.Product.CreationPlace == place)
                        .Select(soi => new SubOrderItemDTO
                        {
                            Id = soi.Id,
                            Amount = soi.Amount,
                            AmountToPay = soi.AmountToPay,
                            Product = new SubOrderItemProduct
                            {
                                Id = soi.Product.Id,
                                Name = soi.Product.Name,
                                Price = soi.Product.Price,
                                ProductId = soi.Product.ProductId,
                                Ingredients = soi.Product.Ingredients.Select(i => new IngredientDTO
                                {
                                    Id = i.Id,
                                    Name = i.Name,
                                    PlusPrice = i.PlusPrice,
                                    ContainType = i.ContainType
                                }).ToList()
                            }
                        }).ToList()
                })
                .OrderBy(so => so.Date)
                .ToList();

            return activeSubOrders;
        }

        public async Task<OrderDTO> PaySubOrderItems(PaySubOrderItems paySubOrderItems)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders).ThenInclude(so => so.SubOrderItems).ThenInclude(soi => soi.Product)
                .Include(cu => cu.Orders).ThenInclude(o => o.Table)
                .FirstOrDefaultAsync(cu => cu.Id == paySubOrderItems.CateringUnitId)
                ?? throw new ArgumentException($"Catering unit with id {paySubOrderItems.CateringUnitId} not found.");

            var dbOrder = dbUnit.Orders
                .FirstOrDefault(so => so.Id == paySubOrderItems.OrderId)
                ?? throw new ArgumentException($"Order with id {paySubOrderItems.OrderId} not found.");

            for (int i = 0; i < paySubOrderItems.SubOrderItemIds.Count; i++)
            {
                var startingSubOrderItemId = paySubOrderItems.SubOrderItemIds[i].SubOrderItemId;
                var startingSubOrderItem = dbOrder.SubOrders
                    .SelectMany(so => so.SubOrderItems)
                    .FirstOrDefault(soi => soi.Id == startingSubOrderItemId);

                if (startingSubOrderItem != null)
                {
                    var itemsWithTheSameProductAndIngredients = dbOrder.SubOrders
                        .SelectMany(so => so.SubOrderItems)
                        .Where(soi =>
                            soi.Product.ProductId == startingSubOrderItem.Product.ProductId &&
                            string.Join(",", soi.Product.Ingredients.Select(i => i.ContainType)) ==
                            string.Join(",", startingSubOrderItem.Product.Ingredients.Select(i => i.ContainType))
                            && soi.AmountToPay > 0)
                        .ToList();

                    for (int j = 0; j < paySubOrderItems.SubOrderItemIds[i].Amount; j++)
                    {
                        var firstItemWithAmountToPay = itemsWithTheSameProductAndIngredients.FirstOrDefault(item => item.AmountToPay > 0)
                            ?? throw new ArgumentException($"No SubOrderItem with id {startingSubOrderItemId} found or all items' AmountToPay is already 0.");
                        firstItemWithAmountToPay.AmountToPay--;
                    }
                }
                else
                {
                    throw new ArgumentException($"SubOrderItem with id {startingSubOrderItemId} not found.");
                }
            }
            //var subOrderId = paySubOrderItems.SubOrderItemIds[i];

            //var subOrderItems = dbOrder.SubOrders
            //    .SelectMany(so => so.SubOrderItems.OrderBy(soi => soi.Id))
            //    .Where(soi => soi.Id == subOrderId && soi.AmountToPay > 0)
            //    .ToList();

            //var firstItemWithAmountToPay = subOrderItems.FirstOrDefault();

            //if (firstItemWithAmountToPay != null)
            //{
            //    firstItemWithAmountToPay.AmountToPay--;
            //}
            //else
            //{
            //    throw new ArgumentException($"No SubOrderItem with id {subOrderId} found or all items' AmountToPay is already 0.");
            //}
            await _dbContext.SaveChangesAsync();

            var allSubOrderItemsPaid = dbOrder.SubOrders.All(subOrder => subOrder.SubOrderItems.All(subOrderItem => subOrderItem.AmountToPay == 0));

            if (allSubOrderItemsPaid)
            {
                dbOrder.Status = OrderStatus.Paid;
                await _dbContext.SaveChangesAsync();
            }

            return new OrderDTO
            {
                Id = dbOrder.Id,
                TableNumber = dbOrder.Table?.Number,
                Status = dbOrder.Status,
                FullPrice = dbOrder.SubOrders.Sum(so => so.SubOrderItems.Sum(soi => soi.Price)),
                SubOrders = dbOrder.SubOrders.Select(oi => new SubOrderDTO
                {
                    Id = oi.Id,
                    Date = oi.Date,
                    DrinkStatus = oi.DrinkStatus,
                    KitchenStatus = oi.KitchenStatus,
                    DiningOption = oi.DiningOption,
                    SubOrderItems = oi.SubOrderItems.Select(soi => new SubOrderItemDTO
                    {
                        Id = soi.Id,
                        Amount = soi.Amount,
                        AmountToPay = soi.AmountToPay
                    }).ToList()
                }).ToList()
            };
        }

        public async Task<OrderPay> GetUnPaidOrderItems(GetOrder order)
        {
            var dbUnit = await _dbContext.CateringUnits
             .Include(cu => cu.Orders).ThenInclude(o => o.SubOrders).ThenInclude(so => so.SubOrderItems).ThenInclude(soi => soi.Product).ThenInclude(p => p.Ingredients)
             .FirstOrDefaultAsync(cu => cu.Id == order.CateringUnitId) ?? throw new ArgumentException($"Catering unit with id {order.CateringUnitId} not found.");

            var dbOrder = dbUnit.Orders.FirstOrDefault(o => o.Id == order.OrderId) ?? throw new ArgumentException($"Order with id {order.OrderId} not found.");
            var groupedSubOrderItems = dbOrder.SubOrders
                .SelectMany(oi => oi.SubOrderItems)
                .Where(soi => soi.AmountToPay > 0)
                .GroupBy(
                    soi => new
                    {
                        soi.Product.ProductId,
                        Ingredients = string.Join(",", soi.Product.Ingredients.Select(i => i.ContainType))
                    })
                .Select(group => new SubOrderItemDTO
                {
                    Id = group.First().Id,
                    Amount = group.Sum(g => g.Amount),
                    AmountToPay = group.Sum(g => g.AmountToPay),
                    Product = new SubOrderItemProduct
                    {
                        Id = group.Key.ProductId,
                        Name = group.First().Product.Name,
                        Price = group.First().Product.Price,
                        ProductId = group.First().Product.ProductId,
                        Ingredients = group.First().Product.Ingredients.Select(i => new IngredientDTO
                        {
                            Id = i.Id,
                            Name = i.Name,
                            PlusPrice = i.PlusPrice,
                            ContainType = i.ContainType
                        }).ToList()
                    }
                })
                .ToList();

            var orderPay = new OrderPay
            {
                SubOrderItems = groupedSubOrderItems
            };

            return orderPay;
        }
    }
}
