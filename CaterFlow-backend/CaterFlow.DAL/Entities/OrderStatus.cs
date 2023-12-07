using System.ComponentModel.DataAnnotations;

namespace CaterFlow.DAL.Entities
{
    public enum OrderStatus
    {
        [Display(Name = "In progress")]
        InProgress,
        [Display(Name = "Ready")]
        Ready,
        [Display(Name = "Paid")]
        Paid,
        [Display(Name = "Served")]
        Served
    }
}
