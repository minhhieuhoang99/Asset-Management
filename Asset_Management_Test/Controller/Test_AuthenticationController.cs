using System.Threading.Tasks;
using Asset_Management.Controllers;
using Asset_Management.DTO.Request;
using Asset_Management.Services.AuthenticationService;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace Asset_Management_Test.Controller
{
  public class Test_AuthenticationController
  {
    private Mock<IAuthenticationService> _authenticateService;
    private static T GetObjectResultContent<T>(ActionResult<T> result)
    {
      return (T)((ObjectResult)result.Result).Value;
    }
    [SetUp]
    public void Setup()
    {
      var result = new string[6] { "abc", "Admin", "True", "Location", "Code", "UserName" };
      _authenticateService = new Mock<IAuthenticationService>();
      _authenticateService.Setup(service => service.Authenticate(It.IsAny<LoginRequest>())).Returns(Task.FromResult(result));

    }

    [Test]
    public async Task Test_Authentication_AccessLogin_ReturnInfoLogin_WhenLogin()
    {
      //method
      var controller = new AuthenticationController(_authenticateService.Object);
      LoginRequest request = null;
      const string infor = "{ token = abc, role = Admin, firstLogin = True, location = Location, code = Code, userName = UserName }";
      //action
      var result = await controller.Login(request);

      var resultType = result as OkObjectResult;
      // Assert

      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(infor, resultType.Value.ToString());
    }

    [Test]
    public async Task Test_Authentication_AccessLogin_ReturnBadRequest_WhenLogin()
    {
      //method
      var controller = new AuthenticationController(_authenticateService.Object);
      LoginRequest request = null;
      _authenticateService.Setup(service => service.Authenticate(It.IsAny<LoginRequest>())).Returns(Task.FromResult((string[])null));
      //action
      var result = await controller.Login(request);

      var resultType = result as BadRequestObjectResult;

      // Assert

      Assert.IsInstanceOf<BadRequestObjectResult>(resultType);
    }

    [Test]
    public async Task Test_Authentication_ChangePassword_ReturnBadRequest_WhenRequestInvalidUser()
    {
      //method
      var controller = new AuthenticationController(_authenticateService.Object);
      ChangePasswordRequest request = null;
      const string message = "Error !";
      _authenticateService.Setup(service => service.ChangePassword(It.IsAny<ChangePasswordRequest>())).Returns(Task.FromResult((string)null));
      //action
      var result = await controller.ChangePassword(request);

      var resultType = result as BadRequestObjectResult;

      // Assert
      Assert.IsInstanceOf<BadRequestObjectResult>(resultType);
      Assert.AreEqual(message, resultType.Value);
    }

    [Test]
    public async Task Test_Authentication_ChangePassword_ReturnBadRequest_WhenRequestWrongPasswordFormat()
    {
      //method
      var controller = new AuthenticationController(_authenticateService.Object);
      ChangePasswordRequest request = null;
      const string message = "Could not change password, you may check the password format";
      _authenticateService.Setup(service => service.ChangePassword(It.IsAny<ChangePasswordRequest>())).Returns(Task.FromResult("Fail"));
      //action
      var result = await controller.ChangePassword(request);

      var resultType = result as BadRequestObjectResult;

      // Assert
      Assert.IsInstanceOf<BadRequestObjectResult>(resultType);
      Assert.AreEqual(message, resultType.Value);
    }

    [Test]
    public async Task Test_Authentication_ChangePassword_ReturnBadRequest_WhenRequestWrongOldPassword()
    {
      //method
      var controller = new AuthenticationController(_authenticateService.Object);
      ChangePasswordRequest request = null;
      const string message = "Password is incorrect";
      _authenticateService.Setup(service => service.ChangePassword(It.IsAny<ChangePasswordRequest>())).Returns(Task.FromResult("Wrong Password"));
      //action
      var result = await controller.ChangePassword(request);

      var resultType = result as BadRequestObjectResult;

      // Assert
      Assert.IsInstanceOf<BadRequestObjectResult>(resultType);
      Assert.AreEqual(message, resultType.Value);
    }

    [Test]
    public async Task Test_Authentication_ChangePassword_ReturnOkObjectResult_WhenRequestValid()
    {
      //method
      var controller = new AuthenticationController(_authenticateService.Object);
      ChangePasswordRequest request = null;
      const string message = "Your password has been changed successfully";
      _authenticateService.Setup(service => service.ChangePassword(It.IsAny<ChangePasswordRequest>())).Returns(Task.FromResult("Success"));
      //action
      var result = await controller.ChangePassword(request);

      var resultType = result as OkObjectResult;

      // Assert
      Assert.IsInstanceOf<OkObjectResult>(resultType);
      Assert.AreEqual(message, resultType.Value);
    }
  }
}