using Caterflow.BLL.DTOs.CateringUnitDTOs;
using CaterFlow.DAL;
using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace Caterflow.BLL.Services.TableService
{
    public class TableService : ITableService
    {
        private readonly CaterFlowDbContext _dbContext;

        public TableService(CaterFlowDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<int> GetTablesByCateringUnitId(int cateringUnitId)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Tables)
                .FirstOrDefaultAsync(cu => cu.Id == cateringUnitId) ?? throw new ArgumentException($"Catering unit with id {cateringUnitId} not found.");

            return dbUnit.Tables.Count;
        }

        public async Task<TableCateringUnitDTO> SetTablesForCateringUnit(TableCateringUnitDTO tables)
        {
            var dbUnit = await _dbContext.CateringUnits
                .Include(cu => cu.Tables)
                .FirstOrDefaultAsync(cu => cu.Id == tables.CateringUnitId) ?? throw new ArgumentException($"Catering unit with id {tables.CateringUnitId} not found.");

            for(int i = dbUnit.Tables.Count; i < tables.TableCounter; i++)
            {
                dbUnit.Tables.Add(new Table { CateringUnitId = dbUnit.Id, Number = i });
            }

            await _dbContext.SaveChangesAsync();
            return new TableCateringUnitDTO { CateringUnitId = dbUnit.Id, TableCounter = dbUnit.Tables.Count };
        }
    }
}
