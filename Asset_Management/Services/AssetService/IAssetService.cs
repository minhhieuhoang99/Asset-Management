using System.Collections.Generic;
using Asset_Management.Repositories.Entities;
using Asset_Management.DTO;
using System.Threading.Tasks;
using Asset_Management.Services.AssetService;

namespace Asset_Management.Services.AssetService
{
  public interface IAssetService
  {
    AssetsEntity GetByCode(string code);
    AssetsEntityDTO GetAssetByCode(string code);
    Task<AssetsEntityDTO> CreateAsset(AssetsEntityDTO asset);
    Task<AssetsEntityDTO> UpdateAsset(AssetsEntityDTO asset, string code);
    Task<bool> Delete(string code);
    Task<List<AssetsEntityDTO>> GetAssetsList(string location);
  }
}
