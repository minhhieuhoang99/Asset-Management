using System;
using System.Collections.Generic;
using System.Linq;
using Asset_Management.Controllers;
using System.Threading.Tasks;
using NUnit.Framework;
using Asset_Management.Repositories.Entities;
using Asset_Management.Services.CategoriesService;
using Asset_Management.Services.CommonService;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Category_Management_Test
{
    public class Test_CategoryController
    {   
        private Mock<ICategoriesService> _categoryService;
        static List<CategoriesEntity> _category = new List<CategoriesEntity>
        {
            new CategoriesEntity{
                CategoryId = 1,
                CategoryPrefix = "Auto"
            },
            new CategoriesEntity{
                CategoryId = 2,
                CategoryPrefix = "Motor"
            }
        };
        private static T GetObjectResultContent<T>(ActionResult<T> result)
        {
            return (T)((ObjectResult)result.Result).Value;
        }
        [SetUp]
        public void Setup()
        {   
            _categoryService = new Mock<ICategoriesService>();
            _categoryService.Setup(s => s.GetCategoriesList()).Returns(Task.FromResult(_category));
        }
        
        [Test]
        public async Task Test_Admin_ReturnJsonCategoryList()
        {   
            // Method
            var controller = new CategoryController(_categoryService.Object);

            // Act
            var result = await controller.GetListCategories();

            // Assert
            Assert.AreEqual( 2, _category.Count);
        }

        [Test]
        public async Task CreateACategorySucess_ReturnACategoryCreated_WhenRequestCreate()
        {   
            // Method
            var controller = new CategoryController(_categoryService.Object);
            var request = new CategoriesEntityDTO
            {
                CategoryPrefix = "PC"
            };
            var response = new CategoriesEntityDTO
            {
                CategoryPrefix = "PC"
            };
            _categoryService.Setup(service => service.CreateCategory(request)).Returns(Task.FromResult((CategoriesEntityDTO)response));

            // Act
            var result = await controller.Create(request);
            var resultObject = GetObjectResultContent<CategoriesEntityDTO>(result);
            var resultType = result.Result as OkObjectResult;

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(resultType);
            Assert.AreEqual(response.CategoryPrefix, resultObject.CategoryPrefix);
        }

        [Test]
        public async Task CreateACategoryFail_ReturnBadRequest_WhenRequestCreate()
        {   
            // Method
            var controller = new CategoryController(_categoryService.Object);
            var request = new CategoriesEntityDTO
            {
                CategoryPrefix = null
            };
            _categoryService.Setup(service => service.CreateCategory(request)).Returns(Task.FromResult<CategoriesEntityDTO>(null));

            // Act
            var result = await controller.Create(request);

            // Assert
            Assert.AreEqual(request.CategoryPrefix, null);
        }
    }
}