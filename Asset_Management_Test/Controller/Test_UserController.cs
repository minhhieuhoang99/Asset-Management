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

namespace User_Management_Test
{
  public class Test_UserController
  {
    private Mock<IUserAssignmentService> _userAssignmentService;
    private static T GetObjectResultContent<T>(ActionResult<T> result)
    {
      return (T)((ObjectResult)result.Result).Value;
    }
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

    [SetUp]
    public void Setup()
    {
      _userAssignmentService = new Mock<IUserAssignmentService>();
      const string userCode = "SD0001";
      _userAssignmentService.Setup(service => service.ViewOwnAssignment(It.IsAny<PagingRequest>(), userCode)).Returns(Task.FromResult(_assignments));
    }

    [Test]
    public async Task Test_UserAssignment_GetOwnAssignments_ReturnOkListAssignment_WhenRequestPaging()
    {
      //method
      var controller = new UserController(_userAssignmentService.Object);
      const int pageSize = 3;
      const int pageIndex = 1;
      const string userCode = "SD0001";
      //action
      var result = await controller.ViewOwnAssignment(pageSize, userCode, pageIndex);

      var resultObject = GetObjectResultContent<PagingResult<AssignmentDTO>>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(pageSize, resultObject.Items.Count);
      Assert.AreEqual(pageIndex, resultObject.PageIndex);
      Assert.AreEqual(_assignments.Items[1].AssignmentId, resultObject.Items[1].AssignmentId);
    }

    [Test]
    public async Task Test_UserAssignment_GetAssignmentIById_ReturnBadRequest_WhenInputInValid()
    {
      //method
      var controller = new UserController(_userAssignmentService.Object);
      const int id = 5;
      _userAssignmentService.Setup(service => service.GetAssignmentById(id)).Returns(Task.FromResult((AssignmentDTO)null));
      //action
      var result = await controller.GetAssignmentById(id);
      var resultType = result.Result as BadRequestObjectResult;

      Assert.IsInstanceOf<BadRequestObjectResult>(resultType);
    }

    [Test]
    public async Task Test_UserAssignment_GetAssignmentIById_ReturnAssignment_WhenInputValid()
    {
      //method
      var controller = new UserController(_userAssignmentService.Object);
      const int id = 1;
      _userAssignmentService.Setup(service => service.GetAssignmentById(id)).Returns(Task.FromResult(_assignments.Items[0]));
      //action
      var result = await controller.GetAssignmentById(id);
      var resultObject = GetObjectResultContent<AssignmentDTO>(result);
      var resultType = result.Result as OkObjectResult;

      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(_assignments.Items[0].AssignmentId, resultObject.AssignmentId);
    }
    [Test]
    public async Task RespondAccepted_ReturnAnAssignmentUpdated_WhenRequestUpdate()
    {
      // Arrange
      var controller = new UserController(_userAssignmentService.Object);
      int id = 1;
      string respond = "Accepted";
      var request = new AssignmentDTO
      {
        AssignmentId = 1,
        AssetCode = "HO00001",
        AssignmentDate = DateTime.Now,
        AssignmentState = (AsmState)0,
        AssigneeCode = "SD0002",
        AssignerCode = "SD0001",
        Note = "demo note",
        ReturnDate = DateTime.Now,
        ReturnState = (ReturnState)0,
      };
      // var result = new AssignmentDTO
      // {
      //   AssignmentId = 1,
      //   AssetCode = "HO00001",
      //   AssignmentDate = DateTime.Now,
      //   AssignmentState = (AsmState)1,
      //   AssigneeCode = "SD0002",
      //   AssignerCode = "SD0001",
      //   Note = "demo note",
      //   ReturnDate = DateTime.Now,
      //   ReturnState = (ReturnState)0,
      // };

      _userAssignmentService.Setup(service => service.RespondAssignment(id ,respond)).Returns(Task.FromResult((AssignmentDTO)request));

      // Act
      var result = await controller.RespondAssignment(id ,respond);
      var resultObject = GetObjectResultContent<AssignmentDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(request.AssignmentState, resultObject.AssignmentState);
    }

    [Test]
    public async Task RespondDeclined_ReturnAnAssignmentUpdated_WhenRequestUpdate()
    {
      // Arrange
      var controller = new UserController(_userAssignmentService.Object);
      int id = 1;
      string respond = "Declined";
      var request = new AssignmentDTO
      {
        AssignmentId = 1,
        AssetCode = "HO00001",
        AssignmentDate = DateTime.Now,
        AssignmentState = (AsmState)0,
        AssigneeCode = "SD0002",
        AssignerCode = "SD0001",
        Note = "demo note",
        ReturnDate = DateTime.Now,
        ReturnState = (ReturnState)0,
      };
      // var result = new AssignmentDTO
      // {
      //   AssignmentId = 1,
      //   AssetCode = "HO00001",
      //   AssignmentDate = DateTime.Now,
      //   AssignmentState = (AsmState)1,
      //   AssigneeCode = "SD0002",
      //   AssignerCode = "SD0001",
      //   Note = "demo note",
      //   ReturnDate = DateTime.Now,
      //   ReturnState = (ReturnState)0,
      // };

      _userAssignmentService.Setup(service => service.RespondAssignment(id ,respond)).Returns(Task.FromResult((AssignmentDTO)request));

      // Act
      var result = await controller.RespondAssignment(id ,respond);
      var resultObject = GetObjectResultContent<AssignmentDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(request.AssignmentState, resultObject.AssignmentState);
    }
  }
}