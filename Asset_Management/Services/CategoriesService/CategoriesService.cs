using System.Collections.Generic;
using Asset_Management.Repositories.Entities;
using Asset_Management.DTO;
using System.Threading.Tasks;
using Asset_Management.Services.AssetService;
using Microsoft.Extensions.Logging;
using Asset_Management.Repositories.EFContext;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Asset_Management.Services.CategoriesService
{
    public class CategoriesService : ICategoriesService
    {
        private readonly ILogger<CategoriesService> _logger;
        private AssetDBContext _assetDBContext;
        public CategoriesService(AssetDBContext assetDBContext,
        ILogger<CategoriesService> logger)
        {
            _logger = logger;
            _assetDBContext = assetDBContext;
        }

        public async Task<List<CategoriesEntity>> GetCategoriesList()
        {
            var listCategories = await _assetDBContext.CategoriesEntity.ToListAsync();
            return listCategories;
        }

        public async Task<CategoriesEntityDTO> CreateCategory(CategoriesEntityDTO category)
        {
            CategoriesEntityDTO result = null;
            using var transaction = _assetDBContext.Database.BeginTransaction();
            try
            {
                var newCategory = new CategoriesEntity
                {
                    CategoryName = category.CategoryName,
                    CategoryPrefix = category.CategoryPrefix.ToUpper(),
                };
                var existedCategory = _assetDBContext.CategoriesEntity
                .Where(c => c.CategoryPrefix.ToLower() == category.CategoryPrefix.ToLower()
                || c.CategoryName == category.CategoryName.ToLower())
                .FirstOrDefault();
                if (existedCategory == null)
                {
                    _assetDBContext.CategoriesEntity.Add(newCategory);
                    await _assetDBContext.SaveChangesAsync();
                    await transaction.CommitAsync();

                    result = new CategoriesEntityDTO()
                    {
                        CategoryName = newCategory.CategoryName,
                        CategoryPrefix = newCategory.CategoryPrefix.ToUpper()
                    };
                    return result;
                };
                return null;
            }
            catch (Exception)
            {
                _logger.LogError("Can't Create Category! Pls try again.");
            }
            return result;
        }
    }
}
