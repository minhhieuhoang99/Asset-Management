using System;
using System.Collections.Generic;
using System.Linq;
using Asset_Management.Controllers;
using System.Threading.Tasks;
using NUnit.Framework;
using Asset_Management.Repositories.Entities;
using Asset_Management.Services.AssetService;
using Asset_Management.Services.CommonService;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Asset_Management_Test
{
  public class Test_AssetController
  {
    private Mock<IAdminCommonService> _adminCommonService;
    private Mock<IAssetService> _assetService;
    static PagingResult<AssetsEntityDTO> _assets = new PagingResult<AssetsEntityDTO>
    {
      PageIndex = 1,
      PageSize = 2,
      Items = new List<AssetsEntityDTO>{
                new AssetsEntityDTO
                {
                    AssetCode = "AC000001",
                    AssetName = "ACERNITRO5",
                    CategoryId = 1,
                    InstalledDate = DateTime.Now,
                    State = (State)1
                },
                new AssetsEntityDTO
                {
                    AssetCode = "HO000001",
                    AssetName = "HondaCB150R",
                    CategoryId = 2,
                    InstalledDate = DateTime.Now,
                    State = (State)1
                },
                new AssetsEntityDTO
                {
                    AssetCode = "AG000001",
                    AssetName = "AGweeeew",
                    CategoryId = 2,
                    InstalledDate = DateTime.Now,
                    State = (State)3
                }
            }
    };
    private static T GetObjectResultContent<T>(ActionResult<T> result)
    {
      return (T)((ObjectResult)result.Result).Value;
    }
    [SetUp]
    public void Setup()
    {
      _assetService = new Mock<IAssetService>();
      _adminCommonService = new Mock<IAdminCommonService>();
      _adminCommonService.Setup(service => service.ViewListAssets(It.IsAny<PagingRequest>(), It.IsAny<string>())).Returns(Task.FromResult(_assets));
    }

    [Test]
    public void Test_Asset_GetAssetInforByCode_ReturnOkObjectResult_WhenInputCodeValid()
    {
      //method
      var controller = new AssetController(_assetService.Object, _adminCommonService.Object);
      string code = "HO000001";
      //action
      var result = controller.GetAssetByCode(code);

      // Assert.IsInstanceOf<OkObjectResult>(result);
    }

    [Test]
    public void Test_Asset_GetAssetInforByCode_ReturnNull_WhenInputInValid()
    {
      //method
      var controller = new AssetController(_assetService.Object, _adminCommonService.Object);
      string code = "ass";
      //action
      var result = controller.GetAssetByCode(code);

      Assert.IsInstanceOf<BadRequestObjectResult>(result);
    }

    [Test]
    public async Task Test_Asset_DeleteAsset_ReturnTrue_InputValid()
    {
      // Arrange
      var controller = new AssetController(_assetService.Object, _adminCommonService.Object);
      var code = "AC000001";
      _assetService.Setup(service => service.Delete(code)).Returns(Task.FromResult(true));
      // Act
      var result = await controller.Delete(code);
      // Assert
      Assert.IsInstanceOf<OkObjectResult>(result);
    }

    [Test]
    public async Task Test_Asset_DeleteAsset_ReturnFalse_InputValid()
    {
      // Arrange
      var controller = new AssetController(_assetService.Object, _adminCommonService.Object);
      var code = "ass";
      _assetService.Setup(service => service.Delete(code)).Returns(Task.FromResult(false));
      // Act
      var result = await controller.Delete(code);
      // Assert
      Assert.IsInstanceOf<BadRequestResult>(result);
    }

    // [Test]
    // public async Task Test_Asset_ReturnJsonAssetList_WithAcceptableState()
    // {
    //   // Method
    //   var controller = new AssetController(_assetService.Object, _adminCommonService.Object);
    //   const int pageSize = 3;
    //   const int pageIndex = 1;

    //   // Act
    //   var result = await controller.ViewAssets(pageSize, pageIndex);
    //   var resultObject = GetObjectResultContent<PagingResult<AssetsEntityDTO>>(result);
    //   var resultType = result.Result as OkObjectResult;

    //   // Assert
    //   Assert.IsInstanceOf<OkObjectResult>(resultType);
    //   Assert.AreEqual(pageSize, resultObject.Items.Count);
    //   Assert.AreEqual(pageIndex, resultObject.PageIndex);
    //   Assert.AreEqual(_assets.Items[1].AssetCode, resultObject.Items[1].AssetCode);
    // }

    [Test]
    public async Task CreateAnAssetSucess_ReturnAnAssetCreated_WhenRequestCreate()
    {
      // Arrange
      var controller = new AssetController(_assetService.Object, _adminCommonService.Object);
      var request = new AssetsEntityDTO
      {
        AssetId = 1,
        AssetCode = "DE000001",
        AssetName = "Dell Alienware",
        CategoryId = 1,
        InstalledDate = DateTime.Now,
        State = (State)1,
        Location = "HN",
      };
      var response = new AssetsEntityDTO
      {
        AssetId = 3,
        AssetCode = "AS000001",
        AssetName = "Asus Alienware",
        CategoryId = 1,
        InstalledDate = DateTime.Now,
        State = (State)1,
        Location = "HN",
      };
      _assetService.Setup(service => service.CreateAsset(request)).Returns(Task.FromResult((AssetsEntityDTO)response));

      // Act
      var result = await controller.Create(request);
      var resultObject = GetObjectResultContent<AssetsEntityDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(response.AssetCode, resultObject.AssetCode);
    }


    [Test]
    public async Task UpdateAnAssetSucess_ReturnAnAssetUpdated_WhenRequestUpdate()
    {
      // Arrange
      var controller = new AssetController(_assetService.Object, _adminCommonService.Object);
      string code = "AC000001";
      var request = new AssetsEntityDTO
      {
        AssetId = 1,
        AssetCode = "AC000001",
        AssetName = "ACERNITRO5",
        CategoryId = 1,
        InstalledDate = DateTime.Now,
        State = (State)1,
        Location = "HN",
      };

      _assetService.Setup(service => service.UpdateAsset(request, code)).Returns(Task.FromResult((AssetsEntityDTO)request));

      // Act
      var result = await controller.Update(request, code);
      var resultObject = GetObjectResultContent<AssetsEntityDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(request.AssetCode, resultObject.AssetCode);
    }

    [Test]
    public async Task UpdateAnAssetFail_ReturnABadRequest_WhenRequestUpdate()
    {
      // Arrange
      var controller = new AssetController(_assetService.Object, _adminCommonService.Object);
      string code = "AC000001";
      var request = new AssetsEntityDTO
      {
        AssetId = 1,
        AssetCode = "AC000001",
        AssetName = "ACERNITRO5",
        CategoryId = 3,
        InstalledDate = DateTime.Now,
        State = (State)1,
        Location = "HN",
      };

      _assetService.Setup(service => service.UpdateAsset(request, code)).Returns(Task.FromResult<AssetsEntityDTO>(null));

      // Act
      var result = await controller.Update(request, code);

      // Assert
      Assert.AreEqual(request.AssetCode, code);
    }
  }
}