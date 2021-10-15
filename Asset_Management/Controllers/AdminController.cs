using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Asset_Management.Services.AdminService;
using Asset_Management.Services.CommonService;
using Asset_Management.Controllers;
using Asset_Management.DTO.Request;
using Asset_Management.DTO;
using System.Threading.Tasks;
using Asset_Management.Repositories.Entities;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Asset_Management.Controllers
{
  [ApiController]
  [Route("[controller]")]
  [Authorize(Roles = "Admin")]
  public class AdminController : Controller
  {
    protected string GetUserLocation()
    {
      var claimsIdentity = User.Identity as ClaimsIdentity;
      return claimsIdentity.FindFirst(ClaimTypes.Locality).Value;
    }
    private readonly IAdminService _adminService;
    private readonly IAdminCommonService _adminCommonService;
    public AdminController(IAdminService adminService, IAdminCommonService adminCommonService)
    {
      _adminService = adminService;
      _adminCommonService = adminCommonService;
    }

    [HttpGet("api/user/listAll")]
    public async Task<List<AppUserDTO>> GetAll()
    {
      var location = GetUserLocation();
      return await _adminService.GetUsersList(location);
    }

    [HttpGet("api/user/list")]
    public async Task<ActionResult<PagingResult<AppUserDTO>>> ViewUsers(
    [FromQuery(Name = "pageSize")] int pageSize, [FromQuery(Name = "pageIndex")] int pageIndex = 1)
    {
      var request = new PagingRequest
      {
        PageSize = pageSize,
        PageIndex = pageIndex,
      };
      var location = GetUserLocation();
      return Ok(await _adminCommonService.ViewListUsers(request, location));

    }

    [HttpGet("api/user/Code")]
    public AppUserDTO GetUserByCode(string code)
    {
      return _adminService.GetUserInforByCode(code);
    }

    [HttpPost("api/user/create")]
    public async Task<ActionResult<AppUserDTO>> Create(AppUserDTO user)
    {
      var newUser = await _adminService.CreateUser(user);
      if (newUser == null)
      {
        return BadRequest("Error !!!");
      }
      return Ok(newUser);
    }

    [HttpPut("api/user/update/{code}")]
    public async Task<ActionResult<AppUserDTO>> Update(AppUserDTO user, string code)
    {
      var updateUser = await _adminService.UpdateUser(user, code);
      if (updateUser == null)
      {
        return BadRequest("Error !!!");
      }
      return Ok(updateUser);
    }

    [HttpPut("api/user/Disable/{code}")]
    public async Task<ActionResult> Disable(string code)
    {
      var result = await _adminService.Disable(code);
      if (result)
      {
        return Ok(result);
      }
      return BadRequest();
    }
  }
}