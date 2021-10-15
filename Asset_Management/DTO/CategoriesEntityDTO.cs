using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asset_Management.DTO
{
  public class CategoriesEntityDTO
  {   
      public string CategoryName { get; set; }
      public string CategoryPrefix { get; set; }
  }
}