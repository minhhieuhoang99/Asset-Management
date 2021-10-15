using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Asset_Management.Controllers;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Asset_Management.Repositories.Entities;
using Asset_Management.Services.AssignmentService;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace Asset_Management_Test.Controller
{
  public class Test_ReturnRequestController
  {
    private Mock<IAdminAssignmentService> _adminAsmService;

    private Mock<ReturnRequestController> _returnRequestController;
    static PagingResult<ReturnRequestDTO> _returnRequests = new PagingResult<ReturnRequestDTO>
    {
      PageIndex = 1,
      PageSize = 2,
      Items = new List<ReturnRequestDTO>{
                new ReturnRequestDTO
                {
                  AssignmentId = 1,
                  AssetCode = "AC000001",
                  AssetName = "ACERNITRO5",
                  RequesterUserName = new Asset_Management.Repositories.Entities.AppUser(){UserName = "abc"},
                  VerifierUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  AssignmentDate = new System.DateTime(),
                  ReturnState = (ReturnState)1,
                  ReturnDate = new System.DateTime(),
                },
                new ReturnRequestDTO
                {
                  AssetCode = "HO000001",
                  AssetName = "HondaCB150R",
                  AssignmentId = 2,
                  RequesterUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  VerifierUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  AssignmentDate = new System.DateTime(),
                  ReturnState = (ReturnState)2,
                  ReturnDate = new System.DateTime(),
                },
                new ReturnRequestDTO
                {
                  AssetCode = "AG000001",
                  AssetName = "AGweeeew",
                  AssignmentId = 3,
                  RequesterUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  VerifierUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  AssignmentDate = new System.DateTime(),
                  ReturnState = (ReturnState)1,
                  ReturnDate = new System.DateTime(),
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
      _adminAsmService = new Mock<IAdminAssignmentService>();
      const string location = "location";
      _returnRequestController = new Mock<ReturnRequestController>(_adminAsmService.Object) { CallBase = true }; ;
      _adminAsmService.Setup(service => service.ViewListReturnRequest(It.IsAny<PagingRequest>(), location)).Returns(Task.FromResult(_returnRequests));
    }

    [Test]
    public async Task Test_ReturnRequest_GetReturnRequests_ReturnOkListReturnRequest_WhenRequestPaging()
    {
      //method
      _returnRequestController.Setup(m => m.GetUserLocation()).Returns("location");
      const int pageSize = 3;
      const int pageIndex = 1;
      //action
      var result = await _returnRequestController.Object.ViewReturnRequests(pageSize, pageIndex);

      var resultObject = GetObjectResultContent<PagingResult<ReturnRequestDTO>>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(pageSize, resultObject.Items.Count);
      Assert.AreEqual(pageIndex, resultObject.PageIndex);
      Assert.AreEqual(_returnRequests.Items[1].ReturnState, resultObject.Items[1].ReturnState);
    }

    [Test]
    public async Task Test_ReturnRequest_GetReturnRequestsByFields_ReturnOkListReturnRequest_WhenRequestSearch()
    {
      //method
      _returnRequestController.Setup(m => m.GetUserLocation()).Returns("location");
      const string value = "AC000001";
      const int pageSize = 2;
      const int pageIndex = 1;
      _adminAsmService.Setup(service => service.ViewListReturnRequestByFields(It.IsAny<PagingSearchRequest<string>>())).Returns(Task.FromResult(_returnRequests));

      var result = await _returnRequestController.Object.ViewReturnRequestsByFields(value, pageSize, pageIndex);

      var resultObject = GetObjectResultContent<PagingResult<ReturnRequestDTO>>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(pageSize, resultObject.PageSize);
    }

    [Test]
    public async Task Test_ReturnRequest_GetReturnRequestsByState_ReturnOkListReturnRequest_WhenRequestSearch()
    {
      //method
      _returnRequestController.Setup(m => m.GetUserLocation()).Returns("location");
      List<ReturnState> value = null;
      const int pageSize = 2;
      const int pageIndex = 1;
      _adminAsmService.Setup(service => service.ViewListReturnRequestByState(It.IsAny<PagingSearchRequest<List<ReturnState>>>()))
      .Returns(Task.FromResult(_returnRequests));

      var result = await _returnRequestController.Object.ViewReturnRequestsByState(value, pageSize, pageIndex);

      var resultObject = GetObjectResultContent<PagingResult<ReturnRequestDTO>>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(pageSize, resultObject.PageSize);
    }

    [Test]
    public async Task Test_ReturnRequest_GetReturnRequestsByDate_ReturnOkListReturnRequest_WhenRequestSearch()
    {
      //method
      _returnRequestController.Setup(m => m.GetUserLocation()).Returns("location");
      DateTime value = DateTime.Now;
      const int pageSize = 2;
      const int pageIndex = 1;
      _adminAsmService.Setup(service => service.ViewListReturnRequestByReturnDate(It.IsAny<PagingSearchRequest<DateTime>>()))
      .Returns(Task.FromResult(_returnRequests));

      var result = await _returnRequestController.Object.ViewReturnRequestsByDate(value, pageSize, pageIndex);

      var resultObject = GetObjectResultContent<PagingResult<ReturnRequestDTO>>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(pageSize, resultObject.PageSize);
    }

    [Test]
    public async Task Test_AdminRespond_Completed_ReturnRequest_ReturnOk_WhenCompletedSuccess(){
      // Arrange
       var controller = new ReturnRequestController(_adminAsmService.Object);
      int id = 1;
      string code = "SD0001";
      string respond ="Completed";
      var returnRequest = new ReturnRequestDTO
        {
            AssetCode = "HO000001",
            AssetName = "HondaCB150R",
            AssignmentId = 1,
            RequesterUserName = new Asset_Management.Repositories.Entities.AppUser(),
            VerifierUserName = new Asset_Management.Repositories.Entities.AppUser(),
            AssignmentDate = new System.DateTime(),
            ReturnState = (ReturnState)1,
            ReturnDate = new System.DateTime(),
        };
        _adminAsmService.Setup(service=>service.AdminRespondReturnRequest(code,id,respond)).Returns(Task.FromResult((ReturnRequestDTO)returnRequest));
        //Act
        var result = await controller.AdminRespondReturnRequest(code,id ,respond);
        var resultObject = GetObjectResultContent<ReturnRequestDTO>(result);
        var resultType = result.Result as OkObjectResult;

        // Assert
        Assert.IsInstanceOf<OkObjectResult>(resultType);
        Assert.AreEqual(returnRequest.ReturnState, resultObject.ReturnState);
    }
    [Test]
    public async Task Test_AdminRespond_Cancel_ReturnRequest_ReturnOk_WhenCancelComplete(){
      //Arrange
      string code ="SD0001";
      int id = 1;
      string respond = "Cancel";
      var controller = new ReturnRequestController(_adminAsmService.Object);
      var returnRequest = new ReturnRequestDTO
      {
          AssetCode = "HO000001",
          AssetName = "HondaCB150R",
          AssignmentId = 1,
          RequesterUserName = new Asset_Management.Repositories.Entities.AppUser(),
          VerifierUserName = new Asset_Management.Repositories.Entities.AppUser(),
          AssignmentDate = new System.DateTime(),
          ReturnState = (ReturnState)1,
          ReturnDate = new System.DateTime(),
      };
      _adminAsmService.Setup(service=>service.AdminRespondReturnRequest(code,id,respond)).Returns(Task.FromResult((ReturnRequestDTO)returnRequest));
      //Act
      var result = await controller.AdminRespondReturnRequest(code,id ,respond);
      var resultObject = GetObjectResultContent<ReturnRequestDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(returnRequest.ReturnState, resultObject.ReturnState);
    }
    [Test]
    public async Task Test_AdminRespond_Complete_ReturnRequest_ReturnNull_WhenNotFoundASMID()
    {
       string code ="SD0001";
      int id = 0;
      string respond = "Completed";
      var controller = new ReturnRequestController(_adminAsmService.Object);
      var returnRequest = new ReturnRequestDTO
      {
          AssetCode = "HO000001",
          AssetName = "HondaCB150R",
          AssignmentId = 1,
          RequesterUserName = new Asset_Management.Repositories.Entities.AppUser(),
          VerifierUserName = new Asset_Management.Repositories.Entities.AppUser(),
          AssignmentDate = new System.DateTime(),
          ReturnState = (ReturnState)1,
          ReturnDate = new System.DateTime(),
      };
      _adminAsmService.Setup(service=>service.AdminRespondReturnRequest(code,id,respond)).Returns(Task.FromResult((ReturnRequestDTO)returnRequest));
      //Act
      var result = await controller.AdminRespondReturnRequest(code,id ,respond);
      var resultObject = GetObjectResultContent<ReturnRequestDTO>(result);
      var resultType = result.Result as BadRequestObjectResult;

       Assert.IsNull(resultType);
    }
    [Test]
    public async Task Test_AdminRespond_Cancel_ReturnRequest_ReturnNull_WhenNotFoundASMID()
    {
      string code ="SD0001";
      int id = 0;
      string respond = "Cancel";
      var controller = new ReturnRequestController(_adminAsmService.Object);
      var returnRequest = new ReturnRequestDTO
      {
          AssetCode = "HO000001",
          AssetName = "HondaCB150R",
          AssignmentId = 1,
          RequesterUserName = new Asset_Management.Repositories.Entities.AppUser(),
          VerifierUserName = new Asset_Management.Repositories.Entities.AppUser(),
          AssignmentDate = new System.DateTime(),
          ReturnState = (ReturnState)1,
          ReturnDate = new System.DateTime(),
      };
      _adminAsmService.Setup(service=>service.AdminRespondReturnRequest(code,id,respond)).Returns(Task.FromResult((ReturnRequestDTO)returnRequest));
      //Act
      var result = await controller.AdminRespondReturnRequest(code,id ,respond);
      var resultObject = GetObjectResultContent<ReturnRequestDTO>(result);
      var resultType = result.Result as BadRequestObjectResult;

       Assert.IsNull(resultType);
    }
    [Test]
    public async Task Test_AdminRespond_Cancel_ReturnRequestAlreadyRespond_ReturnBadRequest_ButNull()
    {
      string code ="SD0001";
      int id = 1;
      string respond = "Cancel";
      var controller = new ReturnRequestController(_adminAsmService.Object);
      var returnRequest = new ReturnRequestDTO
      {
          AssetCode = "HO000001",
          AssetName = "HondaCB150R",
          AssignmentId = 1,
          RequesterUserName = new Asset_Management.Repositories.Entities.AppUser(),
          VerifierUserName = new Asset_Management.Repositories.Entities.AppUser(),
          AssignmentDate = new System.DateTime(),
          ReturnState = (ReturnState)3,
          ReturnDate = new System.DateTime(),
      };
      _adminAsmService.Setup(service=>service.AdminRespondReturnRequest(code,id,respond)).Returns(Task.FromResult((ReturnRequestDTO)returnRequest));
      //Act
      var result = await controller.AdminRespondReturnRequest(code,id ,respond);
      var resultObject = GetObjectResultContent<ReturnRequestDTO>(result);
      var resultType = result.Result as BadRequestObjectResult;
        
      // Assert
      Assert.IsInstanceOf<BadRequestObjectResult>(resultType);
      //Actual result => null , because Return Request with State "Cancel" is remove from list Request, so can't find it
    }
    [Test]
    public async Task Test_AdminRespond_Complete_ReturnRequestAlreadyRespond_ReturnBadRequest_ButNull()
    {
      string code ="SD0001";
      int id =2;
      string respond = "Complete";
      var controller = new ReturnRequestController(_adminAsmService.Object);
      var returnRequest = new ReturnRequestDTO
      {
          AssetCode = "HO000001",
                  AssetName = "HondaCB150R",
                  AssignmentId = 2,
                  RequesterUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  VerifierUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  AssignmentDate = new System.DateTime(),
                  ReturnState = (ReturnState)2,
                  ReturnDate = new System.DateTime(),
      };
      _adminAsmService.Setup(service=>service.AdminRespondReturnRequest(code,id,respond)).Returns(Task.FromResult((ReturnRequestDTO)returnRequest));
      //Act
      var result = await controller.AdminRespondReturnRequest(code,id ,respond);
      var resultObject = GetObjectResultContent<ReturnRequestDTO>(result);
      var resultType = result.Result as BadRequestObjectResult;
        
      // Assert
      Assert.IsInstanceOf<BadRequestObjectResult>(resultType);
    }
  }
}