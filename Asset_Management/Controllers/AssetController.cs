using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Asset_Management.Services.AssetService;
using Asset_Management.Services.CommonService;
using Asset_Management.Controllers;
using Asset_Management.DTO.Request;
using Asset_Management.DTO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Asset_Management.Controllers
{
  [ApiController]
  [Route("[controller]")]
  [Authorize(Roles = "Admin")]
  public class AssetController : Controller
  {
    protected string GetUserLocation()
    {
      var claimsIdentity = User.Identity as ClaimsIdentity;
      return claimsIdentity.FindFirst(ClaimTypes.Locality).Value;
    }
    private readonly IAssetService _assetService;
    private readonly IAdminCommonService _adminCommonService;
    public AssetController(IAssetService assetService, IAdminCommonService adminCommonService)
    {
      _assetService = assetService;
      _adminCommonService = adminCommonService;
    }

    protected string GetUserId()
    {
      var claimsIdentity = User.Identity as ClaimsIdentity;
      return claimsIdentity.FindFirst(ClaimTypes.UserData).Value;
    }

    [HttpGet("api/asset/listAll")]
    public async Task<List<AssetsEntityDTO>> GetAll()
    {
      var location = GetUserLocation();
      return await _assetService.GetAssetsList(location);
    }

    [HttpGet("api/asset/list")]
    public async Task<ActionResult<PagingResult<AssetsEntityDTO>>> ViewAssets(
    [FromQuery(Name = "pageSize")] int pageSize, [FromQuery(Name = "pageIndex")] int pageIndex = 1)
    {
      var request = new PagingRequest
      {
        PageSize = pageSize,
        PageIndex = pageIndex,
      };
      var location = GetUserLocation();
      return Ok(await _adminCommonService.ViewListAssets(request, location));
    }

    [HttpGet("api/asset/{code}")]
    public IActionResult GetAssetByCode(string code)
    {
      var asset = _assetService.GetAssetByCode(code);
      if (asset == null)
      {
        return BadRequest("Error !!!");
      }
      return Ok(asset);
    }

    [HttpPost("api/asset/create")]
    public async Task<ActionResult<AssetsEntityDTO>> Create(AssetsEntityDTO asset)
    {
      var newAsset = await _assetService.CreateAsset(asset);
      if (newAsset == null)
      {
        return BadRequest("Error !!!");
      }
      return Ok(newAsset);
    }

    [HttpPut("api/asset/update/{code}")]
    public async Task<ActionResult<AssetsEntityDTO>> Update(AssetsEntityDTO asset, string code)
    {
      var UpdateAsset = await _assetService.UpdateAsset(asset, code);
      if (UpdateAsset == null)
      {
        return BadRequest("Error !!!");
      }
      return Ok(UpdateAsset);
    }

    [HttpDelete("api/asset/delete/{code}")]
    public async Task<ActionResult> Delete(string code)
    {
      var result = await _assetService.Delete(code);
      if (result)
      {
        return Ok(result);
      }
      return BadRequest();
    }
  }
}