using System.Threading.Tasks;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Asset_Management.Repositories.Entities;

namespace Asset_Management.Services.CommonService
{
  public interface IAdminCommonService
  {
    Task<PagingResult<AppUserDTO>> ViewListUsers(PagingRequest request, string location);
    Task<PagingResult<AssetsEntityDTO>> ViewListAssets(PagingRequest request, string location);
    Task<PagingResult<ReportEntityDTO>> ViewListReports(PagingRequest request, string location);
    Task<PagingResult<AppUserDTO>> ViewListUserByFields(PagingSearchRequest<string> request);
    Task<PagingResult<AssetsEntityDTO>> ViewListAssetByFields(PagingSearchRequest<string> request);
    Task<PagingResult<AppUserDTO>> ViewListUserByType(PagingSearchRequest<Role> request);
    Task<PagingResult<AssetsEntityDTO>> ViewListAssetByCategory(PagingSearchRequest<int> request);
    Task<PagingResult<AssetsEntityDTO>> ViewListAssetByState(PagingSearchRequest<State> request);
  }
}