using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Asset_Management.Services.AssignmentService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Asset_Management.Controllers
{
  [ApiController]
  [Route("api/user")]
  [Authorize(Roles = "User,Admin")]
  public class UserController : Controller
  {
    private readonly IUserAssignmentService _commonService;
    public UserController(IUserAssignmentService commonService)
    {
      _commonService = commonService;
    }

    [HttpPut("create-return/{id}-{code}")]
    public async Task<ActionResult<AssignmentDTO>> CreateReturnRequest(int id, string code)
    {
      var UpdateAssignment = await _commonService.CreateReturnRequest(id,code);
      if (UpdateAssignment == null)
      {
        return BadRequest("Error !!!");
      }
      return Ok(UpdateAssignment);
    }

    [HttpPut("respond/{id}-{respond}")]
    public async Task<ActionResult<AssignmentDTO>> RespondAssignment(int id, string respond)
    {
      var UpdateAssignment = await _commonService.RespondAssignment(id, respond);
      if (UpdateAssignment == null)
      {
        return BadRequest("Error !!!");
      }
      return Ok(UpdateAssignment);
    }

    [HttpGet("assignment/list")]
    public async Task<ActionResult<PagingResult<AssignmentDTO>>> ViewOwnAssignment(
    [FromQuery(Name = "pageSize")] int pageSize, string userCode, [FromQuery(Name = "pageIndex")] int pageIndex = 1)
    {
      var request = new PagingRequest
      {
        PageSize = pageSize,
        PageIndex = pageIndex,
      };
      return Ok(await _commonService.ViewOwnAssignment(request, userCode));
    }

    [HttpGet("assignment/{id}")]
    public async Task<ActionResult<AssignmentDTO>> GetAssignmentById(int id)
    {
      var result = await _commonService.GetAssignmentById(id);
      if (result == null) return BadRequest("Could not find assignment");
      return Ok(result);
    }
  }
}