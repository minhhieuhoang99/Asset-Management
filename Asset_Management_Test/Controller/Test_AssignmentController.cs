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
  public class Test_AssignmentController
  {
    private Mock<IAdminAssignmentService> _adminAsmService;
    private Mock<IUserAssignmentService> _userAsmService;
    private Mock<AssignmentController> _assignmentController;
    static PagingResult<AssignmentDTO> _assignments = new PagingResult<AssignmentDTO>
    {
      PageIndex = 1,
      PageSize = 2,
      Items = new List<AssignmentDTO>{
                new AssignmentDTO
                {
                  AssignmentId = 1,
                  AssetCode = "AC000001",
                  AssetName = "ACERNITRO5",
                  AssigneeUserName = new Asset_Management.Repositories.Entities.AppUser(){UserName = "abc"},
                  AssignerUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  AssignmentDate = new System.DateTime(),
                  AssignmentState = (AsmState)1,
                },
                new AssignmentDTO
                {
                  AssetCode = "HO000001",
                  AssetName = "HondaCB150R",
                  AssignmentId = 2,
                  AssigneeUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  AssignerUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  AssignmentDate = new System.DateTime(),
                  AssignmentState = (AsmState)0,
                },
                new AssignmentDTO
                {
                  AssetCode = "AG000001",
                  AssetName = "AGweeeew",
                  AssignmentId = 3,
                  AssigneeUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  AssignerUserName = new Asset_Management.Repositories.Entities.AppUser(),
                  AssignmentDate = new System.DateTime(),
                  AssignmentState = (AsmState)0,
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
      _userAsmService = new Mock<IUserAssignmentService>();
      _assignmentController = new Mock<AssignmentController>(_adminAsmService.Object) { CallBase = true }; ;
      const string location = "location";
      _adminAsmService.Setup(service => service.ViewListAssignment(It.IsAny<PagingRequest>(), location)).Returns(Task.FromResult(_assignments));
    }

    [Test]
    public async Task Test_Assignment_GetAssignments_ReturnOkListAssignment_WhenRequestPaging()
    {
      //method
      _assignmentController.Setup(m => m.GetUserLocation()).Returns("location");

      const int pageSize = 3;
      const int pageIndex = 1;
      //action
      var result = await _assignmentController.Object.ViewAssignments(pageSize, pageIndex);

      var resultObject = GetObjectResultContent<PagingResult<AssignmentDTO>>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(pageSize, resultObject.Items.Count);
      Assert.AreEqual(pageIndex, resultObject.PageIndex);
      Assert.AreEqual(_assignments.Items[1].AssignmentId, resultObject.Items[1].AssignmentId);
    }

    [Test]
    public async Task Test_Assignment_GetAssignmentsByFields_ReturnOkListAssignment_WhenRequestSearch()
    {
      //method
      _assignmentController.Setup(m => m.GetUserLocation()).Returns("location");
      const string value = "AC000001";
      const int pageSize = 2;
      const int pageIndex = 1;
      _adminAsmService.Setup(service => service.ViewListAssignmentByFields(It.IsAny<PagingSearchRequest<string>>())).Returns(Task.FromResult(_assignments));

      var result = await _assignmentController.Object.ViewAssignmentsByFields(value, pageSize, pageIndex);

      var resultObject = GetObjectResultContent<PagingResult<AssignmentDTO>>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(pageSize, resultObject.PageSize);
    }

    [Test]
    public async Task Test_Assignment_GetAssignmentsState_ReturnOkListAssignment_WhenRequestSearch()
    {
      //method
      _assignmentController.Setup(m => m.GetUserLocation()).Returns("location");
      const List<AsmState> value = null;
      const int pageSize = 2;
      const int pageIndex = 1;
      _adminAsmService.Setup(service => service.ViewListAssignmentByState(It.IsAny<PagingSearchRequest<List<AsmState>>>()))
      .Returns(Task.FromResult(_assignments));

      var result = await _assignmentController.Object.ViewAssignmentsByState(value, pageSize, pageIndex);

      var resultObject = GetObjectResultContent<PagingResult<AssignmentDTO>>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(pageSize, resultObject.PageSize);
    }

    [Test]
    public async Task Test_Assignment_GetAssignmentsByDate_ReturnOkListAssignment_WhenRequestSearch()
    {
      //method
      _assignmentController.Setup(m => m.GetUserLocation()).Returns("location");
      DateTime value = DateTime.Now;
      const int pageSize = 2;
      const int pageIndex = 1;
      _adminAsmService.Setup(service => service.ViewListAssignmentByAsmDate(It.IsAny<PagingSearchRequest<DateTime>>()))
      .Returns(Task.FromResult(_assignments));

      var result = await _assignmentController.Object.ViewAssignmentsByDate(value, pageSize, pageIndex);

      var resultObject = GetObjectResultContent<PagingResult<AssignmentDTO>>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(pageSize, resultObject.PageSize);
    }

    [Test]
    public async Task Test_Assignment_GetAssignmentIById_ReturnBadRequest_WhenInputInValid()
    {
      //method
      var controller = new AssignmentController(_adminAsmService.Object);
      const int id = 5;
      _adminAsmService.Setup(service => service.GetAssignmentById(id)).Returns(Task.FromResult((AssignmentDTO)null));
      //action
      var result = await controller.GetAssignmentById(id);
      var resultType = result.Result as BadRequestObjectResult;

      Assert.IsInstanceOf<BadRequestObjectResult>(resultType);
    }

    [Test]
    public async Task Test_Assignment_GetAssignmentIById_ReturnAssignment_WhenInputValid()
    {
      //method
      var controller = new AssignmentController(_adminAsmService.Object);
      const int id = 1;
      _adminAsmService.Setup(service => service.GetAssignmentById(id)).Returns(Task.FromResult(_assignments.Items[0]));
      //action
      var result = await controller.GetAssignmentById(id);
      var resultObject = GetObjectResultContent<AssignmentDTO>(result);
      var resultType = result.Result as OkObjectResult;

      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(_assignments.Items[0].AssignmentId, resultObject.AssignmentId);
    }

    [Test]
    public async Task Test_Assignment_DeleteAssignment_ReturnOkResult_WhenInputValidId()
    {
      //method
      var controller = new AssignmentController(_adminAsmService.Object);
      const int id = 1;
      _adminAsmService.Setup(service => service.DeleteAssignment(id)).Returns(Task.FromResult(true));
      //action
      var result = await controller.DeleteAssignment(id);

      Assert.IsInstanceOf<OkResult>(result);
    }

    [Test]
    public async Task Test_Assignment_DeleteAssignment_ReturnBadRequest_WhenInputInvalidId()
    {
      //method
      var controller = new AssignmentController(_adminAsmService.Object);
      const int id = 5;
      _adminAsmService.Setup(service => service.DeleteAssignment(id)).Returns(Task.FromResult(false));
      //action
      var result = await controller.DeleteAssignment(id);

      Assert.IsInstanceOf<BadRequestResult>(result);
    }
    [Test]
    public async Task CreateAnAssignmentSucess_ReturnAnAssignmentCreated_WhenRequestCreate()
    {
      // Arrange
      var controller = new AssignmentController(_adminAsmService.Object);
      var request = new AssignmentDTO
      {
        AssignmentId = 0,
        AssetCode = "HO00001",
        AssignmentDate = DateTime.Now,
        AssignmentState = 0,
        AssigneeCode = "SD0002",
        AssignerCode = "SD0001",
        Note = "demo note",
      };
      var response = new AssignmentDTO
      {
        AssetCode = "HO00001",
        AssignmentDate = DateTime.Now,
        Note = "demo note",
        AssignmentState = 0,
        AssigneeCode = "SD0002",
        AssignerCode = "SD0001",
      };
      _adminAsmService.Setup(service => service.CreateAssignment(request)).Returns(Task.FromResult((AssignmentDTO)response));

      // Act
      var result = await controller.Create(request);
      var resultObject = GetObjectResultContent<AssignmentDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(response.AssetCode, resultObject.AssetCode);
    }
    [Test]
    public async Task UpdateAnAssetSucess_ReturnAnAssetUpdated_WhenRequestUpdate()
    {
      // Arrange
      var controller = new AssignmentController(_adminAsmService.Object);
      int id = 1;
      var request = new AssignmentDTO
      {
        AssignmentId = 1,
        AssetCode = "HO00001",
        AssignmentDate = DateTime.Now,
        AssignmentState = 0,
        AssigneeCode = "SD0002",
        AssignerCode = "SD0001",
        Note = "demo note",
      };

      _adminAsmService.Setup(service => service.UpdateAssignment(request, id)).Returns(Task.FromResult((AssignmentDTO)request));

      // Act
      var result = await controller.Update(request, id);
      var resultObject = GetObjectResultContent<AssignmentDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(request.AssetCode, resultObject.AssetCode);
    }

    [Test]
    public async Task UpdateAnAssetFail_ReturnABadRequest_WhenRequestUpdate()
    {
      // Arrange
      var controller = new AssignmentController(_adminAsmService.Object);
      int id = 1;
      var request = new AssignmentDTO
      {
        AssignmentId = 1,
        AssetCode = "HO00001",
        AssignmentDate = DateTime.Now,
        AssignmentState = 0,
        AssigneeCode = "SD0002",
        AssignerCode = "SD0001",
        Note = "demo note",
      };

      _adminAsmService.Setup(service => service.UpdateAssignment(request, id)).Returns(Task.FromResult<AssignmentDTO>(null));

      // Act
      var result = await controller.Update(request, id);

      // Assert
      Assert.AreEqual(request.AssignmentId, id);
    }

    [Test]
    public async Task CreateReturnRequestSucess_ReturnARequestCreate_WhenRequestCreate()
    {
      // Arrange
      var controller = new UserController(_userAsmService.Object);
      int id = 1;
      string code = "SD0001";
      var response = new AssignmentDTO
      {
        AssignmentId = 1,
        AssetCode = "HO00001",
        AssignmentDate = DateTime.Now,
        AssignmentState = (AsmState)1,
        AssigneeCode = "SD0002",
        AssignerCode = "SD0001",
        Note = "demo note",
        ReturnDate = DateTime.Now,
        ReturnState = (ReturnState)1,
      };
      _userAsmService.Setup(service => service.CreateReturnRequest(id,code)).Returns(Task.FromResult((AssignmentDTO)response));

      // Act
      var result = await controller.CreateReturnRequest(id,code);
      var resultObject = GetObjectResultContent<AssignmentDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(response.AssetCode, resultObject.AssetCode);
      Assert.AreEqual(response.AssignmentState, resultObject.AssignmentState);
      Assert.AreEqual(response.ReturnState, resultObject.ReturnState);
    }

    [Test]
    public async Task CreateReturnRequest_WhenThisReturnRequestIsAlreadyCreate_ReturnABadRequest()
    {
      // Arrange
      // Arrange
      var controller = new UserController(_userAsmService.Object);
      int id = 1;
      string code = "SD0001";
      var response = new AssignmentDTO
      {
        AssignmentId = 1,
        AssetCode = "HO00001",
        AssignmentDate = DateTime.Now,
        AssignmentState = (AsmState)1,
        AssigneeCode = "SD0002",
        AssignerCode = "SD0001",
        Note = "demo note",
        ReturnDate = DateTime.Now,
        ReturnState = (ReturnState)1,
      };
      _userAsmService.Setup(service => service.CreateReturnRequest(id,code)).Returns(Task.FromResult((AssignmentDTO)response));

      // Act
      var result = await controller.CreateReturnRequest(id,code);
      var resultObject = GetObjectResultContent<AssignmentDTO>(result);
      var resultType = result.Result as BadRequestObjectResult;

      // Assert
      Assert.IsInstanceOf<BadRequestObjectResult>(resultType);

    }

  }
}