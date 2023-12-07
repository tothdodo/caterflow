using System.ComponentModel.DataAnnotations;

namespace CaterFlow.DAL.Entities
{
    public enum ProductCreationPlace
    {
        [Display(Name = "Drink")]
        Drink,
        [Display(Name = "Kitchen")]
        Kitchen
    }
}
