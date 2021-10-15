using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Asset_Management.Repositories.Entities;
using Asset_Management.Services.AssignmentService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Asset_Management.Controllers
{
  [ApiController]
  [Route("api/admin/assignment")]
  [Authorize(Roles = "Admin")]
  public class AssignmentController : Controller
  {
    [NonAction]
    public virtual string GetUserLocation()
    {
      var claimsIdentity = User.Identity as ClaimsIdentity;
      return claimsIdentity.FindFirst(ClaimTypes.Locality).Value;
    }
    private readonly IAdminAssignmentService _adminAsmService;
    public AssignmentController(IAdminAssignmentService adminAsmService)
    {
      _adminAsmService = adminAsmService;
    }
    [HttpGet("list")]
    public async Task<ActionResult<PagingResult<AssignmentDTO>>> ViewAssignments([FromQuery(Name = "pageSize")] int pageSize,
    [FromQuery(Name = "pageIndex")] int pageIndex = 1)
    {
      var request = new PagingRequest
      {
        PageSize = pageSize,
        PageIndex = pageIndex,
      };
      var location = GetUserLocation();
      return Ok(await _adminAsmService.ViewListAssignment(request, location));
    }

    [HttpGet("list-by")]
    public async Task<ActionResult<PagingResult<AssignmentDTO>>> ViewAssignmentsByFields(
    [FromQuery(Name = "searchValue")] string value,
    [FromQuery(Name = "pageSize")] int pageSize,
    [FromQuery(Name = "pageIndex")] int pageIndex = 1)
    {
      var request = new PagingSearchRequest<string>
      {
        SearchValue = value,
        Location = GetUserLocation(),
        PageIndex = pageIndex,
        PageSize = pageSize,
      };
      return Ok(await _adminAsmService.ViewListAssignmentByFields(request));
    }

  [HttpGet("list-filter-state")]
    public async Task<ActionResult<PagingResult<AssignmentDTO>>> ViewAssignmentsByState(
    [FromQuery(Name = "searchValue[]")]  List<AsmState> value,
    [FromQuery(Name = "pageSize")] int pageSize,
    [FromQuery(Name = "pageIndex")] int pageIndex = 1)
    {
      var request = new PagingSearchRequest<List<AsmState>>
      {
        SearchValue = value,
        Location = GetUserLocation(),
        PageIndex = pageIndex,
        PageSize = pageSize,
      };
      return Ok(await _adminAsmService.ViewListAssignmentByState(request));
    }

    [HttpGet("list-filter-date")]
    public async Task<ActionResult<PagingResult<AssignmentDTO>>> ViewAssignmentsByDate(
    [FromQuery(Name = "searchValue")] DateTime value,
    [FromQuery(Name = "pageSize")] int pageSize,
    [FromQuery(Name = "pageIndex")] int pageIndex = 1)
    {
      var request = new PagingSearchRequest<DateTime>
      {
        SearchValue = value,
        Location = GetUserLocation(),
        PageIndex = pageIndex,
        PageSize = pageSize,
      };
      return Ok(await _adminAsmService.ViewListAssignmentByAsmDate(request));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AssignmentDTO>> GetAssignmentById(int id)
    {
      var result = await _adminAsmService.GetAssignmentById(id);
      if (result == null)
      {
        return BadRequest("Not found assignment");
      }
      return Ok(result);
    }

    [HttpPost("create")]
    public async Task<ActionResult<AssignmentDTO>> Create(AssignmentDTO assignment)
    {
      if (assignment == null)
        return BadRequest("NULL");
      var newAssignment = await _adminAsmService.CreateAssignment(assignment);
      if (newAssignment == null)
      {
        return BadRequest("Error !!!");
      }
      return Ok(newAssignment);
    }

    [HttpPut("update/{id}")]
    public async Task<ActionResult<AssignmentDTO>> Update(AssignmentDTO assignment, int id)
    {
      var UpdateAssignment = await _adminAsmService.UpdateAssignment(assignment, id);
      if (UpdateAssignment == null)
      {
        return BadRequest("Error !!!");
      }
      return Ok(UpdateAssignment);
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAssignment(int id)
    {
      var result = await _adminAsmService.DeleteAssignment(id);
      if (result)
      {
        return Ok();
      }
      return BadRequest();
    }
  }
}