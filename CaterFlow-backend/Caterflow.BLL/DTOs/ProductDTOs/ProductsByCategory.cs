namespace Caterflow.BLL.DTOs.ProductDTOs
{
    public class ProductsByCategory
    {
        public string CategoryName { get; set; } = null!;
        public List<ProductHeader> Products { get; set; } = null!;
    }
}
