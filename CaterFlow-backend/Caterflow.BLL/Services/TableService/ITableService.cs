using Caterflow.BLL.DTOs.CateringUnitDTOs;

namespace Caterflow.BLL.Services.TableService
{
    public interface ITableService
    {
        Task<int> GetTablesByCateringUnitId(int cateringUnitId);
        Task<TableCateringUnitDTO> SetTablesForCateringUnit(TableCateringUnitDTO tables);
    }
}
