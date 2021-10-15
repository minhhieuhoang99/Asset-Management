using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Asset_Management.DTO;
using System.Threading.Tasks;
using Asset_Management.Services.CategoriesService;
using Asset_Management.Repositories.Entities;
using Microsoft.AspNetCore.Authorization;

namespace Asset_Management.Controllers
{
  [ApiController]
  [Route("[controller]")]
  [Authorize(Roles = "Admin")]
  public class CategoryController : Controller
  {
    private readonly ICategoriesService _categoriesService;
    public CategoryController(ICategoriesService categoriesService)
    {
      _categoriesService = categoriesService;
    }

    [HttpGet("/api/categories/list")]
    public async Task<List<CategoriesEntity>> GetListCategories()
    {
      return await _categoriesService.GetCategoriesList();
    }
    [HttpPost("api/categories/create")]
    public async Task<ActionResult<CategoriesEntityDTO>> Create(CategoriesEntityDTO category)
    {
      var newCategory = await _categoriesService.CreateCategory(category);
      if (newCategory == null)
      {
        return BadRequest("Can't create category pls try again!!!");
      }
      return Ok(newCategory);
    }
  }
}