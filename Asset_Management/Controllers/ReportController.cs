using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using System.Threading.Tasks;
using Asset_Management.Services.ReportService;
using Asset_Management.Services.CommonService;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Asset_Management.Controllers
{
  [ApiController]
  [Route("[controller]")]
  [Authorize(Roles = "Admin")]
  public class ReportController : Controller
  {
    [NonAction]
    public virtual string GetUserLocation()
    {
      var claimsIdentity = User.Identity as ClaimsIdentity;
      return claimsIdentity.FindFirst(ClaimTypes.Locality).Value;
    }
    
    private readonly IReportService _reportService;
    private readonly IAdminCommonService _adminCommonService;
    public ReportController(IReportService reportService, IAdminCommonService adminCommonService)
    {
      _reportService = reportService;
      _adminCommonService = adminCommonService;
    }

    [HttpGet("/api/report")]
    public async Task<ActionResult<List<ReportEntityDTO>>> GetAll()
    {
      var location = GetUserLocation();
      return await _reportService.GetAssetsListByCategory(location);
    }

    [HttpGet("api/report/list")]
    public async Task<ActionResult<PagingResult<ReportEntityDTO>>> ViewReports(
    [FromQuery(Name = "pageSize")] int pageSize, [FromQuery(Name = "pageIndex")] int pageIndex = 1)
    {
      var request = new PagingRequest
      {
        PageSize = pageSize,
        PageIndex = pageIndex,
      };
      var location = GetUserLocation();
      return Ok(await _adminCommonService.ViewListReports(request, location));
    }
    
  }
}