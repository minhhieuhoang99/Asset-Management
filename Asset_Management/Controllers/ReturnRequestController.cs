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
    [Route("api/admin/return-request")]
    [Authorize(Roles = "Admin")]
    public class ReturnRequestController : Controller
    {
        [NonAction]
        public virtual string GetUserLocation()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.Locality).Value;
        }
        private readonly IAdminAssignmentService _adminAsmService;
        public ReturnRequestController(IAdminAssignmentService adminAsmService)
        {
            _adminAsmService = adminAsmService;
        }

        [HttpGet("list")]
        public async Task<ActionResult<PagingResult<ReturnRequestDTO>>> ViewReturnRequests([FromQuery(Name = "pageSize")] int pageSize,
        [FromQuery(Name = "pageIndex")] int pageIndex = 1)
        {
            var request = new PagingRequest
            {
                PageSize = pageSize,
                PageIndex = pageIndex,
            };
            var location = GetUserLocation();
            return Ok(await _adminAsmService.ViewListReturnRequest(request, location));
        }


        [HttpGet("list-by")]
        public async Task<ActionResult<PagingResult<ReturnRequestDTO>>> ViewReturnRequestsByFields(
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
            return Ok(await _adminAsmService.ViewListReturnRequestByFields(request));
        }

        [HttpGet("list-filter-state")]
        public async Task<ActionResult<PagingResult<ReturnRequestDTO>>> ViewReturnRequestsByState(
          [FromQuery(Name = "searchValue[]")] List<ReturnState> value,
          [FromQuery(Name = "pageSize")] int pageSize,
          [FromQuery(Name = "pageIndex")] int pageIndex = 1)
        {
            var request = new PagingSearchRequest<List<ReturnState>>
            {
                SearchValue = value,
                Location = GetUserLocation(),
                PageIndex = pageIndex,
                PageSize = pageSize,
            };
            return Ok(await _adminAsmService.ViewListReturnRequestByState(request));
        }

        [HttpGet("list-filter-date")]
        public async Task<ActionResult<PagingResult<ReturnRequestDTO>>> ViewReturnRequestsByDate(
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
            return Ok(await _adminAsmService.ViewListReturnRequestByReturnDate(request));
        }
        [HttpPut("respond/{code}-{id}-{respond}")]
        public async Task<ActionResult<ReturnRequestDTO>> AdminRespondReturnRequest(string code, int id, string respond)
        {
        var respondReturn = await _adminAsmService.AdminRespondReturnRequest(code, id, respond);
        if(respondReturn == null)
        {
            return BadRequest("Error !!!");
        }
        return Ok(respondReturn);
        }
    }
}