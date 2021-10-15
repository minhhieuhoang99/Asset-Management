using System.Linq;
using System.Threading.Tasks;
using Asset_Management.Repositories.Entities;
using Asset_Management.Repositories.EFContext;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Asset_Management.Services.CommonService
{
  public class AdminCommonService : IAdminCommonService
  {
    private AssetDBContext _assetDBContext;
    public AdminCommonService(AssetDBContext assetDBContext)
    {
      _assetDBContext = assetDBContext;
    }

    public async Task<PagingResult<ReportEntityDTO>> ViewListReports(PagingRequest request, string location)
    {            
      var listCategories = await _assetDBContext.CategoriesEntity.ToListAsync();

      List<ReportEntityDTO> listDTO = new List<ReportEntityDTO>();

      for(int i = 1; i<= listCategories.Count() ; i++)
      {

          var listAssets = _assetDBContext.AssetsEntity.Where(x => x.CategoryId == i && x.Location == location ).ToList();

          var categoryName =  listCategories.Find(x => x.CategoryId == i).CategoryName;

          var totalCount = listAssets.Count() ;
          var availableCount = listAssets.Where(x => x.State == (State)0 ).Count() ;
          var notAvailableCount = listAssets.Where(x => x.State == (State)1 ).Count() ;
          var assigned = listAssets.Where(x => x.State == (State)2 ).Count() ;
          var waitingCount = listAssets.Where(x => x.State == (State)3 ).Count() ;
          var recycledCount = listAssets.Where(x => x.State == (State)4 ).Count() ;

          var report = new ReportEntityDTO
          {
              CategoryName = categoryName,
              TotalCount = totalCount,
              AssignedCount = assigned,
              AvailableCount = availableCount,
              NotAvailableCount = notAvailableCount,
              WaitingCount = waitingCount,
              RecycledCount = recycledCount
          };
          listDTO.Add(report);
      }

      int totalRow = listDTO.Count();

      var data = listDTO.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .ToList();

      var pagedResult = new PagingResult<ReportEntityDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;

    }

    public async Task<PagingResult<AppUserDTO>> ViewListUsers(PagingRequest request, string location)
    {
      var users = _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == location).Select(x => new AppUserDTO
      {
        Code = x.Code,
        FirstName = x.FirstName,
        LastName = x.LastName,
        Dob = x.Dob,
        JoinDate = x.JoinDate,
        Location = x.Location,
        Gender = x.Gender,
        UserName = x.UserName,
        Type = x.Type,
        IsDisabled = x.IsDisabled,
      });
      int totalRow = await users.CountAsync();

      var data = await users.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new AppUserDTO()
          {
            Code = x.Code,
            FirstName = x.FirstName,
            LastName = x.LastName,
            Dob = x.Dob,
            JoinDate = x.JoinDate,
            Location = x.Location,
            Gender = x.Gender,
            UserName = x.UserName,
            Type = x.Type,
            IsDisabled = x.IsDisabled
          }).ToListAsync();

      var pagedResult = new PagingResult<AppUserDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<PagingResult<AssetsEntityDTO>> ViewListAssets(PagingRequest request, string location)
    {
      var assets = _assetDBContext.AssetsEntity
      .Include(x => x.Category).Include(x => x.AssignmentList)
      .Where(x => (x.State == (State)0 || x.State == (State)1 || x.State == (State)2) && x.Location == location)
      .Select(x => new AssetsEntityDTO
      {
        AssetId = x.AssetId,
        AssetCode = x.AssetCode,
        AssetName = x.AssetName,
        Specification = x.Specification,
        CategoryId = x.CategoryId,
        Category = x.Category,
        InstalledDate = x.InstalledDate,
        State = x.State,
      });
      int totalRow = await assets.CountAsync();

      var data = await assets.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new AssetsEntityDTO()
          {
            AssetId = x.AssetId,
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            Specification = x.Specification,
            CategoryId = x.CategoryId,
            Category = x.Category,
            InstalledDate = x.InstalledDate,
            State = x.State,
          }).ToListAsync();

      var pagedResult = new PagingResult<AssetsEntityDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<PagingResult<AppUserDTO>> ViewListUserByFields(PagingSearchRequest<string> request)
    {
      var users = _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == request.Location
      && ((x.FirstName + ' ' + x.LastName).Contains(request.SearchValue) || x.Code.Contains(request.SearchValue)))
      .Select(x => new AppUserDTO
      {
        Code = x.Code,
        FirstName = x.FirstName,
        LastName = x.LastName,
        Dob = x.Dob,
        JoinDate = x.JoinDate,
        Location = x.Location,
        Gender = x.Gender,
        UserName = x.UserName,
        Type = x.Type,
        IsDisabled = x.IsDisabled,
      });
      int totalRow = await users.CountAsync();

      var data = await users.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new AppUserDTO()
          {
            Code = x.Code,
            FirstName = x.FirstName,
            LastName = x.LastName,
            Dob = x.Dob,
            JoinDate = x.JoinDate,
            Location = x.Location,
            Gender = x.Gender,
            UserName = x.UserName,
            Type = x.Type,
            IsDisabled = x.IsDisabled
          }).ToListAsync();

      var pagedResult = new PagingResult<AppUserDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<PagingResult<AssetsEntityDTO>> ViewListAssetByFields(PagingSearchRequest<string> request)
    {
      var assets = _assetDBContext.AssetsEntity
      .Include(x => x.Category).Include(x => x.AssignmentList)
      .Where(x => (x.AssetCode.Contains(request.SearchValue) || x.AssetName.Contains(request.SearchValue)) && x.Location == request.Location)
      .Select(x => new AssetsEntityDTO
      {
        AssetId = x.AssetId,
        AssetCode = x.AssetCode,
        AssetName = x.AssetName,
        Specification = x.Specification,
        CategoryId = x.CategoryId,
        Category = x.Category,
        InstalledDate = x.InstalledDate,
        State = x.State,
      });
      int totalRow = await assets.CountAsync();

      var data = await assets.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new AssetsEntityDTO()
          {
            AssetId = x.AssetId,
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            Specification = x.Specification,
            CategoryId = x.CategoryId,
            Category = x.Category,
            InstalledDate = x.InstalledDate,
            State = x.State,
          }).ToListAsync();

      var pagedResult = new PagingResult<AssetsEntityDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<PagingResult<AppUserDTO>> ViewListUserByType(PagingSearchRequest<Role> request)
    {
      var users = _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == request.Location && x.Type == request.SearchValue)
      .Select(x => new AppUserDTO
      {
        Code = x.Code,
        FirstName = x.FirstName,
        LastName = x.LastName,
        Dob = x.Dob,
        JoinDate = x.JoinDate,
        Location = x.Location,
        Gender = x.Gender,
        UserName = x.UserName,
        Type = x.Type,
        IsDisabled = x.IsDisabled,
      });
      int totalRow = await users.CountAsync();

      var data = await users.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new AppUserDTO()
          {
            Code = x.Code,
            FirstName = x.FirstName,
            LastName = x.LastName,
            Dob = x.Dob,
            JoinDate = x.JoinDate,
            Location = x.Location,
            Gender = x.Gender,
            UserName = x.UserName,
            Type = x.Type,
            IsDisabled = x.IsDisabled
          }).ToListAsync();

      var pagedResult = new PagingResult<AppUserDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<PagingResult<AssetsEntityDTO>> ViewListAssetByCategory(PagingSearchRequest<int> request)
    {
      var assets = _assetDBContext.AssetsEntity
      .Include(x => x.Category).Include(x => x.AssignmentList)
      .Where(x => x.CategoryId == request.SearchValue && x.Location == request.Location)
      .Select(x => new AssetsEntityDTO
      {
        AssetId = x.AssetId,
        AssetCode = x.AssetCode,
        AssetName = x.AssetName,
        Specification = x.Specification,
        CategoryId = x.CategoryId,
        Category = x.Category,
        InstalledDate = x.InstalledDate,
        State = x.State,
      });
      int totalRow = await assets.CountAsync();

      var data = await assets.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new AssetsEntityDTO()
          {
            AssetId = x.AssetId,
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            Specification = x.Specification,
            CategoryId = x.CategoryId,
            Category = x.Category,
            InstalledDate = x.InstalledDate,
            State = x.State,
          }).ToListAsync();

      var pagedResult = new PagingResult<AssetsEntityDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<PagingResult<AssetsEntityDTO>> ViewListAssetByState(PagingSearchRequest<State> request)
    {
      var assets = _assetDBContext.AssetsEntity
      .Include(x => x.Category).Include(x => x.AssignmentList)
      .Where(x => x.State == request.SearchValue && x.Location == request.Location)
      .Select(x => new AssetsEntityDTO
      {
        AssetId = x.AssetId,
        AssetCode = x.AssetCode,
        AssetName = x.AssetName,
        Specification = x.Specification,
        CategoryId = x.CategoryId,
        Category = x.Category,
        InstalledDate = x.InstalledDate,
        State = x.State,
      });
      int totalRow = await assets.CountAsync();

      var data = await assets.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new AssetsEntityDTO()
          {
            AssetId = x.AssetId,
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            Specification = x.Specification,
            CategoryId = x.CategoryId,
            Category = x.Category,
            InstalledDate = x.InstalledDate,
            State = x.State,
          }).ToListAsync();

      var pagedResult = new PagingResult<AssetsEntityDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }
  }
}