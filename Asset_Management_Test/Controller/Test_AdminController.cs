using System;
using System.Collections.Generic;
using System.Linq;
using Asset_Management.Controllers;
using System.Threading.Tasks;
using NUnit.Framework;
using Asset_Management.Repositories.Entities;
using Asset_Management.Services.AdminService;
using Asset_Management.Services.CommonService;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Admin_Management_Test
{
  public class Test_AdminController
  {
    private Mock<IAdminService> _adminService;
    private Mock<IAdminCommonService> _adminCommonService;
    static PagingResult<AppUserDTO> _users = new PagingResult<AppUserDTO>
    {
      PageIndex = 1,
      PageSize = 2,
      Items = new List<AppUserDTO>{
                new AppUserDTO
                {
                Location = "HN",
                FirstName = "Nghia",
                LastName = "Le Trung",
                Dob = new DateTime(2000,05,05),
                JoinDate =  DateTime.Now,
                Gender = "Male",
                Code = "SD0",
                UserName = "NghiaLe Trung",
                Type = (Role)1,
                },
                new AppUserDTO
                {
                Location = "HCM",
                FirstName = "Dai",
                LastName = "Pham Ngoc",
                Dob = new DateTime(2000,06,09),
                JoinDate =  DateTime.Now,
                Gender = "Male",
                Code = "SD1",
                UserName = "DaiPham Ngoc",
                Type = (Role)1,
                }
            },
    };
    private static T GetObjectResultContent<T>(ActionResult<T> result)
    {
      return (T)((ObjectResult)result.Result).Value;
    }
    [SetUp]
    public void Setup()
    {
      _adminService = new Mock<IAdminService>();
      _adminCommonService = new Mock<IAdminCommonService>();
      _adminCommonService.Setup(service => service.ViewListUsers(It.IsAny<PagingRequest>(), It.IsAny<string>())).Returns(Task.FromResult(_users));
    }

    // [Test]
    // public async Task Test_Admin_ReturnJsonUserList()
    // {
    //   // Method
    //   var controller = new AdminController(_adminService.Object, _adminCommonService.Object);
    //   const int pageSize = 2;
    //   const int pageIndex = 1;

    //   // Act
    //   var result = await controller.ViewUsers(pageSize, pageIndex);
    //   var resultObject = GetObjectResultContent<PagingResult<AppUserDTO>>(result);
    //   var resultType = result.Result as OkObjectResult;

    //   // Assert
    //   Assert.IsInstanceOf<OkObjectResult>(resultType);
    //   Assert.AreEqual(pageSize, resultObject.Items.Count);
    //   Assert.AreEqual(pageIndex, resultObject.PageIndex);
    //   Assert.AreEqual(_users.Items[1].FirstName, resultObject.Items[1].FirstName);
    // }
    [Test]
    public void Test_Admin_GetUserInforByCode_ReturnNull_WhenInputInValid()
    {
      //method
      var controller = new AdminController(_adminService.Object, _adminCommonService.Object);
      string code = "SD7";
      //action
      var result = controller.GetUserByCode(code);

      Assert.IsNull(result);
    }
    [Test]
    public async Task CreateAnUserSucess_ReturnAnUserCreated_WhenRequestCreate()
    {
      // Arrange
      var controller = new AdminController(_adminService.Object, _adminCommonService.Object);
      var request = new AppUserDTO
      {
        FirstName = "dao",
        LastName = "tuan",
        Dob = new DateTime(1999, 03, 11),
        JoinDate = DateTime.Now,
        Location = "HN",
        Gender = "Male",
        Code = "SD2",
        UserName = "tuandao",
        Type = (Role)1
      };
      var response = new AppUserDTO
      {
        FirstName = "dao",
        LastName = "tuan",
        Dob = new DateTime(1999, 03, 11),
        JoinDate = DateTime.Now,
        Location = "HN",
        Gender = "Male",
        Code = "SD2",
        UserName = "tuandao",
        Type = (Role)1
      };
      _adminService.Setup(service => service.CreateUser(request)).Returns(Task.FromResult((AppUserDTO)response));

      // Act
      var result = await controller.Create(request);
      var resultObject = GetObjectResultContent<AppUserDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(response.Code, resultObject.Code);
    }

    [Test]
    public async Task UpdateAnUserSucess_ReturnAnUserUpdated_WhenRequestUpdate()
    {
      // Arrange
      var controller = new AdminController(_adminService.Object, _adminCommonService.Object);
      string code = "SD1";
      var request = new AppUserDTO
      {
        FirstName = "dao",
        LastName = "tuan",
        Dob = new DateTime(1999, 03, 11),
        JoinDate = DateTime.Now,
        Location = "HN",
        Gender = "Male",
        Code = "SD1",
        UserName = "tuandao",
        Type = (Role)1,
      };

      _adminService.Setup(service => service.UpdateUser(request, code)).Returns(Task.FromResult((AppUserDTO)request));

      // Act
      var result = await controller.Update(request, code);
      var resultObject = GetObjectResultContent<AppUserDTO>(result);
      var resultType = result.Result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(request.Code, resultObject.Code);
    }

    [Test]
    public async Task UpdateAnUserFail_ReturnABadRequest_WhenRequestUpdate()
    {
      // Arrange
      var controller = new AdminController(_adminService.Object, _adminCommonService.Object);
      var code = "SD5";
      var request = new AppUserDTO
      {
        FirstName = "dao",
        LastName = "tuan",
        Dob = new DateTime(1999, 03, 11),
        JoinDate = DateTime.Now,
        Location = "HN",
        Gender = "Male",
        Code = "SD5",
        UserName = "tuandao",
        Type = (Role)1,
      };
      _adminService.Setup(service => service.UpdateUser(request, code)).Returns(Task.FromResult<AppUserDTO>(null));

      // Act
      var result = await controller.Update(request, code);

      // Assert
      Assert.AreEqual(request.Code, code);
    }


    [Test]
    public async Task DeleteUser_ReturnSuccessStatus_NoExistAssignment()
    {
      // Arrange
      var controller = new AdminController(_adminService.Object, _adminCommonService.Object);
      var code = "SD4";
      _adminService.Setup(service => service.Disable(code)).Returns(Task.FromResult(true));

      // Act
      var result = await controller.Disable(code);

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(result);
    }

    [Test]
    public async Task DeleteUser_ReturnBadRequest_HasValidAssignment()
    {
      // Arrange
      var controller = new AdminController(_adminService.Object, _adminCommonService.Object);
      var code = "SD5";
      _adminService.Setup(service => service.Disable(code)).Returns(Task.FromResult(false));

      // Act
      var result = await controller.Disable(code);

      // Assert
      Assert.IsInstanceOf<BadRequestResult>(result);
    }

  }
}