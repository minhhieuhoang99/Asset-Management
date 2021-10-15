using System;
using System.Collections.Generic;
using System.Linq;
using Asset_Management.Controllers;
using System.Threading.Tasks;
using NUnit.Framework;
using Asset_Management.Repositories.Entities;
using Asset_Management.Services.CategoriesService;
using Asset_Management.Services.AssetService;
using  Asset_Management.Services.ReportService;
using Asset_Management.Services.CommonService;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Report_Management_Test
{
    public class Test_ReportController
    {   
        private Mock<IReportService> _reportService;
        private Mock<ReportController> _reportController;
        static List<ReportEntityDTO> _report = new List<ReportEntityDTO>
        {
            new ReportEntityDTO{
                CategoryName = "Abc",
                TotalCount = 1,
                AssignedCount = 0,
                AvailableCount = 1,
                NotAvailableCount = 0,
                WaitingCount = 0,
                RecycledCount = 0
            },
            new ReportEntityDTO{
                CategoryName = "Def",
                TotalCount = 1,
                AssignedCount = 0,
                AvailableCount = 0,
                NotAvailableCount = 1,
                WaitingCount = 0,
                RecycledCount = 0
            }
        };
        private static T GetObjectResultContent<T>(ActionResult<T> result)
        {
            return (T)((ObjectResult)result.Result).Value;
        }

        [SetUp]
        public void Setup()
        {   
            _reportService = new Mock<IReportService>();
            _reportController = new Mock<ReportController>(_reportService.Object) { CallBase = true }; ;
            const string location = "location";
            _reportService.Setup(s => s.GetAssetsListByCategory(location)).Returns(Task.FromResult(_report));
        }
        
        [Test]
        public async Task Test_ReturnSuccess_ReportList()
        {   
            // Method
            _reportController.Setup(m => m.GetUserLocation()).Returns("location");

            var result = await _reportController.Object.GetAll();

            // Assert
            Assert.AreEqual( 2, _report.Count);
        }


    }
}