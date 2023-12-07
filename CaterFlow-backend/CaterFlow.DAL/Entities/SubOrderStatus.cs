using System.ComponentModel.DataAnnotations;

namespace CaterFlow.DAL.Entities
{
    public enum SubOrderStatus
    {
        [Display(Name = "In progress")]
        InProgress,
        [Display(Name = "Ready")]
        Ready
    }
}
