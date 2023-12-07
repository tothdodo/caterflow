using System.ComponentModel.DataAnnotations;

namespace CaterFlow.DAL.Entities
{
    public enum ContainType
    {
        [Display(Name = "Default")]
        Default,
        [Display(Name = "Plus")]
        Plus,
        [Display(Name = "Minus")]
        Minus
    }
}
