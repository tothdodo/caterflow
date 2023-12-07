using Caterflow.BLL.DTOs.CategoryDTOs;
using Caterflow.BLL.DTOs.CateringUnitDTOs;
using Caterflow.BLL.DTOs.UserDTOs;
using CaterFlow.DAL;
using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace Caterflow.BLL.Services.CateringUnitService
{
    public class CateringUnitService : ICateringUnitService
    {
        private readonly CaterFlowDbContext _dbContext;
        private readonly TokenService _tokenService;
        public CateringUnitService(CaterFlowDbContext dbContext, TokenService tokenService)
        {
            _dbContext = dbContext;
            _tokenService = tokenService;
        }

        public async Task<CateringUnitDTO?> GetCateringUnitById(int unitId)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Categories)
                .Include(cu => cu.CateringUnitUsers)
                .ThenInclude(cuu => cuu.User)
                .SingleOrDefaultAsync(cu => cu.Id == unitId);

            if (dbUnit == null)
            {
                return null;
            }
            else
            {
                return new CateringUnitDTO
                {
                    Id = dbUnit.Id,
                    Name = dbUnit.Name,
                    Categories = dbUnit.Categories
                        .Select(category => new CategoryDTO
                        {
                            Id = category.Id,
                            Name = category.Name
                        }).ToList(),
                    CateringUnitUsers = dbUnit.CateringUnitUsers
                        .Select(cateringUnitUser => new CateringUnitUserDTO
                        {
                            UserId = cateringUnitUser.UserId,
                            UserEmail = cateringUnitUser.User.Email,
                            NickName = cateringUnitUser.NickName,
                        }).ToList()
                };
            }
        }

        public async Task<List<CateringUnitDTO>> GetCateringUnits(int userId)
        {
            return await _dbContext.CateringUnits
                .Where(cu => cu.CateringUnitUsers.Any(cuUser => cuUser.UserId == userId))
                .Select(cu => new CateringUnitDTO
                {
                    Id = cu.Id,
                    Name = cu.Name,
                    Categories = cu.Categories
                        .Select(category => new CategoryDTO
                        {
                            Id = category.Id,
                            Name = category.Name
                        }).ToList(),
                    CateringUnitUsers = cu.CateringUnitUsers
                        .Select(cateringUnitUser => new CateringUnitUserDTO
                        {
                            UserId = cateringUnitUser.UserId,
                            UserEmail = cateringUnitUser.User.Email,
                            NickName = cateringUnitUser.NickName,
                        }).ToList()
                })
                .ToListAsync();
        }

        public async Task<CateringUnitUserDTO> AddUnitUser(AddUser addUser)
        {
            var dbUnit = await _dbContext.CateringUnits.Include(cu => cu.CateringUnitUsers).SingleOrDefaultAsync(cu => cu.EntryCode == addUser.EntryCode)
                ?? throw new Exception($"Catering unit not found.");

            var dbUser = await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == addUser.UserId)
                ?? throw new Exception($"User with id {addUser.UserId} not found.");

            if (dbUnit.CateringUnitUsers.Any(cuu => cuu.UserId == addUser.UserId))
            {
                throw new Exception("You are already in this catering unit.");
            }

            var cateringUnitUser = new CateringUnitUser
            {
                UserId = dbUser.Id,
                User = dbUser,
                CateringUnitId = dbUnit.Id,
                CateringUnit = dbUnit,
                NickName = addUser.NickName,
                Role = Role.NewComer,
            };

            dbUser.CateringUnitUsers.Add(cateringUnitUser);
            await _dbContext.SaveChangesAsync();

            return new CateringUnitUserDTO
            {
                UserId = cateringUnitUser.UserId,
                UserEmail = cateringUnitUser.User.Email,
                NickName = cateringUnitUser.NickName,
                CateringUnitId = cateringUnitUser.CateringUnitId,
                Role = cateringUnitUser.Role,
                TokenString = _tokenService.GenerateToken(dbUser)
            };
        }

        public async Task<CateringUnitDTO?> InsertCateringUnit(CreateCateringUnitDTO newUnit)
        {
            var dbUnit = await _dbContext.CateringUnits.SingleOrDefaultAsync(cu => cu.Name == newUnit.CateringUnitName);
            if (dbUnit != null)
            {
                throw new Exception("Catering unit with this name already exists.");
            }

            int RandomEntryCode = new Random().Next(100000, 1000000);
            var checkEntryCodeExist = await _dbContext.CateringUnits.SingleOrDefaultAsync(cu => cu.EntryCode == RandomEntryCode);
            while (checkEntryCodeExist != null)
            {
                RandomEntryCode = new Random().Next(100000, 1000000);
                checkEntryCodeExist = await _dbContext.CateringUnits.SingleOrDefaultAsync(cu => cu.EntryCode == RandomEntryCode);
            }

            dbUnit = new CateringUnit
            {
                Name = newUnit.CateringUnitName,
                EntryCode = RandomEntryCode,
                CateringUnitUsers = new HashSet<CateringUnitUser>()
            };

            dbUnit.Tables = Enumerable.Range(1, newUnit.TableCount)
                .Select(tableNumber => new Table
                {
                    Number = tableNumber,
                    CateringUnit = dbUnit
                })
                .ToList();

            var creatorUser =
                await _dbContext.Users.SingleOrDefaultAsync(cu => cu.Id == newUnit.CreatorId) ??
                throw new Exception("Creator user not exist.");


            var cateringUnitUser = new CateringUnitUser
            {
                UserId = creatorUser.Id,
                User = creatorUser,
                CateringUnitId = dbUnit.Id,
                CateringUnit = dbUnit,
                NickName = newUnit.CreatorNickName,
                Role = Role.Administrator,
            };

            creatorUser.CateringUnitUsers.Add(cateringUnitUser);

            dbUnit.CateringUnitUsers.Add(cateringUnitUser);
            _dbContext.CateringUnits.Add(dbUnit);

            await _dbContext.SaveChangesAsync();

            var cateringUnitUserDTOs = dbUnit.CateringUnitUsers
                    .Select(cateringUnitUser => new CateringUnitUserDTO
                    {
                        UserId = cateringUnitUser.UserId,
                        UserEmail = cateringUnitUser.User.Email,
                        NickName = cateringUnitUser.NickName,
                        TokenString = _tokenService.GenerateToken(cateringUnitUser.User),   
                    })
                    .ToList();

            return new CateringUnitDTO
            {
                Id = dbUnit.Id,
                Name = dbUnit.Name,
                CateringUnitUsers = cateringUnitUserDTOs,
            };
        }

        public async Task<UnitDetails?> GetEntryCodeByUnitId(int unitId)
        {
            var dbUnit = await _dbContext.CateringUnits.Include(cu => cu.Tables).SingleOrDefaultAsync(cu => cu.Id == unitId) ?? throw new Exception("Catering unit not found.");
            return new UnitDetails { EntryCode = dbUnit.EntryCode, TableCounter = dbUnit.Tables.Count };
        }

        public async Task<List<CateringUnitUserDTO>> GetUsersOfUnit(int unitId)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.CateringUnitUsers)
                .ThenInclude(cuu => cuu.User)
                .SingleOrDefaultAsync(cu => cu.Id == unitId) ?? throw new Exception("Catering unit not found.");

            return dbUnit.CateringUnitUsers.Select(cateringUnitUser => new CateringUnitUserDTO
            {
                UserId = cateringUnitUser.UserId,
                UserEmail = cateringUnitUser.User.Email,
                NickName = cateringUnitUser.NickName,
                CateringUnitId = cateringUnitUser.CateringUnitId,
                Role = cateringUnitUser.Role
            }).ToList();
        }

        public async Task<CateringUnitUserDTO> ChangeRoleOfUser(ChangeRole changeRole)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.CateringUnitUsers)
                .ThenInclude(cuu => cuu.User)
                .SingleOrDefaultAsync(cu => cu.Id == changeRole.CateringUnitId) ?? throw new Exception("Catering unit not found.");

            var dbUser =  dbUnit.CateringUnitUsers.FirstOrDefault(cuu => cuu.UserId == changeRole.UserId) ?? throw new Exception("User not found.");

            dbUser.Role = changeRole.Role;

            await _dbContext.SaveChangesAsync();

            return new CateringUnitUserDTO
            {
                UserId = dbUser.UserId,
                UserEmail = dbUser.User.Email,
                NickName = dbUser.NickName,
                CateringUnitId = dbUser.CateringUnitId,
                Role = dbUser.Role
            };
        }
    }
}
