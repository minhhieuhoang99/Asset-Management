using System.Collections.Generic;
using Asset_Management.Repositories.Entities;
using Asset_Management.DTO;
using System.Threading.Tasks;
using Asset_Management.Services.AssetService;

namespace Asset_Management.Services.CategoriesService
{
    public interface ICategoriesService
    {
       Task<List<CategoriesEntity>> GetCategoriesList();
       Task<CategoriesEntityDTO> CreateCategory(CategoriesEntityDTO category);
    }
}
