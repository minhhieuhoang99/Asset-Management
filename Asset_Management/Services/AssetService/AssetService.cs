using System.Collections.Generic;
using Asset_Management.Repositories.Entities;
using Asset_Management.Repositories.EFContext;
using Asset_Management.Services.AssetService;
using Asset_Management.DTO;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;

namespace Asset_Management.Services.AssetService
{
  public class AssetService : IAssetService
  {
    private readonly ILogger<AssetService> _logger;
    private AssetDBContext _assetDBContext;
    public AssetService(AssetDBContext assetDBContext,
    ILogger<AssetService> logger)
    {
      _logger = logger;
      _assetDBContext = assetDBContext;
    }

    public AssetsEntity GetByCode(string code) => _assetDBContext.AssetsEntity
    .Include(x => x.Category).Include(x => x.AssignmentList).ThenInclude(x => x.AssignUsers)
    .Where(u => u.AssetCode == code).FirstOrDefault();

    public async Task<List<AssetsEntityDTO>> GetAssetsList(string location)
    {
      var listAssets = await _assetDBContext.AssetsEntity.Where(x => x.Location == location).Select(x => new AssetsEntityDTO
      {
        AssetId = x.AssetId,
        AssetCode = x.AssetCode,
        AssetName = x.AssetName,
        Specification = x.Specification,
        CategoryId = x.CategoryId,
        Category = x.Category,
        InstalledDate = x.InstalledDate,
        State = x.State,
        AssignmentList = x.AssignmentList,
        Location = x.Location
      }).ToListAsync();
      return listAssets;
    }

    public AssetsEntityDTO GetAssetByCode(string code)
    {
      AssetsEntityDTO result = null;
      try
      {
        var asset = GetByCode(code);
        var asmAsset = asset.AssignmentList.ToList();
        if (asset == null) return null;
        result = new AssetsEntityDTO()
        {
          AssetName = asset.AssetName,
          Specification = asset.Specification,
          Location = asset.Location,
          CategoryId = asset.CategoryId,
          Category = asset.Category,
          InstalledDate = asset.InstalledDate,
          AssignmentList = asset.AssignmentList,
          State = asset.State,
          AssetCode = asset.AssetCode,
        };
        return result;
      }
      catch
      {
        _logger.LogError("Couldn't find asset!!");
      }
      return result;
    }
    public async Task<AssetsEntityDTO> CreateAsset(AssetsEntityDTO asset)
    {
      AssetsEntity newAsset = null;

      AssetsEntityDTO result = null;
      using var transaction = _assetDBContext.Database.BeginTransaction();
      try
      {
        newAsset = new AssetsEntity
        {
          AssetName = asset.AssetName,
          Specification = asset.Specification,
          CategoryId = asset.CategoryId,
          InstalledDate = asset.InstalledDate,
          State = asset.State,
          Location = asset.Location,
          AssetCode = asset.Prefix,
          Prefix = asset.Prefix,
        };
        var existedCategory = _assetDBContext.CategoriesEntity.Find(newAsset.CategoryId);
        if (existedCategory != null)
        {
          if (newAsset.State == (State)2)
          {
            return null;
          }
          else
          {
            newAsset.Prefix = existedCategory.CategoryPrefix;
            newAsset.CountPrefix = _assetDBContext.AssetsEntity.Where(a => a.Prefix == newAsset.Prefix).Count() + 1;
            _assetDBContext.AssetsEntity.Add(newAsset);
            await _assetDBContext.SaveChangesAsync();
            await transaction.CommitAsync();
            result = new AssetsEntityDTO()
            {
              AssetCode = newAsset.AssetCode,
              AssetName = newAsset.AssetName,
              Specification = newAsset.Specification,
              CategoryId = newAsset.CategoryId,
              Category = newAsset.Category,
              InstalledDate = newAsset.InstalledDate,
              State = newAsset.State,
              Location = newAsset.Location,
              Prefix = newAsset.Prefix,
            };
            return result;
          }
        }
        return null;
      }
      catch
      {
        _logger.LogError("Couldn't Create Asset");
      }
      return result;
    }

    public async Task<AssetsEntityDTO> UpdateAsset(AssetsEntityDTO asset, string code)
    {
      using var transaction = _assetDBContext.Database.BeginTransaction();
      AssetsEntityDTO result = null;
      try
      {
        var existingAsset = GetByCode(code);
        if (existingAsset == null)
        {
          return null;
        }
        else
        {
          TimeZone time2 = TimeZone.CurrentTimeZone;
          DateTime test = time2.ToUniversalTime(asset.InstalledDate);
          var sea = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
          var seatime = TimeZoneInfo.ConvertTimeFromUtc(test, sea);
          existingAsset.AssetName = asset.AssetName;
          existingAsset.Specification = asset.Specification;
          existingAsset.InstalledDate = seatime;
          existingAsset.State = asset.State;
          if (asset.State == (State)2)
          {
            var existedAssetAssignment = _assetDBContext.AssignmentEntity
            .Where(x => x.Asset.AssetId == existingAsset.AssetId)
            .FirstOrDefault();
            if (existedAssetAssignment == null)
            {
              return null;
            }
          }
          _assetDBContext.Entry(existingAsset).State = EntityState.Modified;
          await _assetDBContext.SaveChangesAsync();
          await transaction.CommitAsync();
          result = new AssetsEntityDTO()
          {
            AssetId = existingAsset.AssetId,
            AssetCode = existingAsset.AssetCode,
            AssetName = existingAsset.AssetName,
            Specification = existingAsset.Specification,
            CategoryId = existingAsset.CategoryId,
            Category = existingAsset.Category,
            InstalledDate = existingAsset.InstalledDate,
            State = existingAsset.State,
            Location = existingAsset.Location,
          };
          return result;
        }
      }
      catch
      {
        _logger.LogError("Couldn't Update Asset");
      }
      return result;
    }
    public async Task<bool> Delete(string code)
    {
      var existedAsmAsset = await _assetDBContext.AssignmentEntity.Where(x => x.Asset.AssetCode == code).FirstOrDefaultAsync();
      var asset = GetByCode(code);
      if (asset != null)
      {
        if (existedAsmAsset == null)
        {
          _assetDBContext.AssetsEntity.Remove(asset);
          await _assetDBContext.SaveChangesAsync();
          return true;
        }
        return false;
      }
      return false;
    }
  }
}