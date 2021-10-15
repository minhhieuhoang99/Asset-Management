using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asset_Management.Repositories.Entities
{
  public class CategoriesEntity
  {   
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryPrefix { get; set; }
  }
}