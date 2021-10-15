using System;
using System.Linq;
using System.Threading.Tasks;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Asset_Management.Repositories.EFContext;
using Asset_Management.Repositories.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace Asset_Management.Services.AssignmentService.implements
{
  public class UserAssignmentService : IUserAssignmentService
  {
    private AssetDBContext _assetDBContext;
    private readonly ILogger<UserAssignmentService> _logger;
    public UserAssignmentService(AssetDBContext assetDBContext, ILogger<UserAssignmentService> logger)
    {
      _assetDBContext = assetDBContext;
      _logger = logger;
    }
    public AssetsEntity GetASByCode(string code) => _assetDBContext.AssetsEntity
     .Include(x => x.Category).Include(x => x.AssignmentList).ThenInclude(x => x.AssignUsers)
     .Where(u => u.AssetCode == code).FirstOrDefault();

    public async Task<AssignmentDTO> RespondAssignment(int id, string respond)
    {
      using var transaction = _assetDBContext.Database.BeginTransaction();
      AssignmentDTO result = null;
      try
      {
        var existingAssignment = await _assetDBContext.AssignmentEntity.Include(x => x.Asset).Include(x => x.AssignUsers)
        .FirstOrDefaultAsync(x => x.AsmId == id);
        var existingAsset = GetASByCode(existingAssignment.Asset.AssetCode);
        if (existingAssignment == null)
        {
          return null;
        }
        else if (existingAssignment.ReturnState == (ReturnState)0 && existingAssignment.AsmState == (AsmState)0 && respond == "Accepted")
        {
          // existingAssignment.ReturnState = (ReturnState)0;
          existingAssignment.AsmState = (AsmState)1;
          _assetDBContext.Entry(existingAssignment).State = EntityState.Modified;
          await _assetDBContext.SaveChangesAsync();
          await transaction.CommitAsync();
        }
        else if (existingAssignment.ReturnState == (ReturnState)0 && existingAssignment.AsmState == (AsmState)0 && respond == "Declined")
        {
          // existingAssignment.ReturnState = (ReturnState)0;
          existingAsset.State = (State)0;
          existingAssignment.AsmState = (AsmState)2;
          _assetDBContext.Entry(existingAssignment).State = EntityState.Modified;
          await _assetDBContext.SaveChangesAsync();
          await transaction.CommitAsync();
        }
        else
        {
          _logger.LogError("Couldn't create respond for returning this Assignment");
          return null;
        }
        result = new AssignmentDTO()
        {
          AssetCode = existingAssignment.Asset.AssetCode,
          AssignmentDate = existingAssignment.AssignedDate,
          Note = existingAssignment.Note,
          AssignmentState = existingAssignment.AsmState,
          AssigneeCode = existingAssignment.AssigneeCode,
          AssignerCode = existingAssignment.AssignerCode,
          ReturnDate = existingAssignment.ReturnDate,
          ReturnState = existingAssignment.ReturnState,
        };
        return result;
      }
      catch
      {
        _logger.LogError("Couldn't create respond for returning this Assignment");
      }
      return result;
    }
    public AppUser GetAUByCode(string code) => _assetDBContext.AppUsers.Include(x => x.AssignmentList).Where(u => u.Code == code && u.IsDisabled == true).FirstOrDefault();
    public async Task<AssignmentDTO> CreateReturnRequest(int id, string code)
    {
      using var transaction = _assetDBContext.Database.BeginTransaction();
      
      AssignmentDTO result = null;
      try
      {
        var existingUser = await _assetDBContext.AppUsers.FirstOrDefaultAsync(x => x.Code == code);
        var existingAssignment = await _assetDBContext.AssignmentEntity.Include(x => x.Asset).Include(x => x.AssignUsers)
        .FirstOrDefaultAsync(x => x.AsmId == id && x.ReturnState != (ReturnState)1);
        var requester = GetAUByCode(code);
        if (existingAssignment == null)
        {
          return null;
        }
        if (existingUser == null)
        {
          return null;
        }
        // else if(existingAssignment.AsmState == (AsmState)2 && existingAssignment.AsmState == (AsmState)0)
        // {
        //   _logger.LogError("Couldn't create request for returning this Assignment");
        // }
        else if (existingAssignment.AsmState == (AsmState)1)
        {
          TimeZone time2 = TimeZone.CurrentTimeZone;
          DateTime test = time2.ToUniversalTime(DateTime.Now);
          var sea = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
          var seatime = TimeZoneInfo.ConvertTimeFromUtc(test, sea);
          existingAssignment.RequesterCode = existingUser.Code;
          existingAssignment.ReturnDate = seatime;
          existingAssignment.ReturnState = (ReturnState)1;
          existingAssignment.AsmState = (AsmState)1;
          existingAssignment.AssignUsers.Add(requester);
          _assetDBContext.Entry(existingAssignment).State = EntityState.Modified;
          await _assetDBContext.SaveChangesAsync();
          await transaction.CommitAsync();
        }
        else
        {
          _logger.LogError("Couldn't create request for returning this Assignment");
          return null;
        }
        result = new AssignmentDTO()
        {
          AssetCode = existingAssignment.Asset.AssetCode,
          AssignmentDate = existingAssignment.AssignedDate,
          Note = existingAssignment.Note,
          AssignmentState = existingAssignment.AsmState,
          AssigneeCode = existingAssignment.AssigneeCode,
          AssignerCode = existingAssignment.AssignerCode,
          ReturnDate = existingAssignment.ReturnDate,
          ReturnState = existingAssignment.ReturnState,
        };
        return result;
      }
      catch
      {
        _logger.LogError("Couldn't create request for returning this Assignment");
      }
      return result;
    }
    public async Task<PagingResult<AssignmentDTO>> ViewOwnAssignment(PagingRequest request, string userCode)
    {
      TimeZone time2 = TimeZone.CurrentTimeZone;
      DateTime test = time2.ToUniversalTime(DateTime.Now);
      var sea = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
      var currentDate = TimeZoneInfo.ConvertTimeFromUtc(test, sea);
      var assignmentList = _assetDBContext.AssignmentEntity.Include(x => x.Asset).Include(x => x.AssignUsers)
      .Where(x => x.AsmState != (AsmState)2 && x.AssigneeCode == userCode && x.AssignedDate <= currentDate && x.ReturnState != (ReturnState)2)
      .Select(x => new AssignmentDTO
      {
        AssignmentId = x.AsmId,
        AssetCode = x.Asset.AssetCode,
        AssetName = x.Asset.AssetName,
        AssigneeUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.AssigneeCode),
        AssignerUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.AssignerCode),
        AssignmentDate = x.AssignedDate,
        AssignmentState = x.AsmState,
        ReturnState = x.ReturnState,
      });

      int totalRow = await assignmentList.CountAsync();

      var data = await assignmentList.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new AssignmentDTO()
          {
            AssignmentId = x.AssignmentId,
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            AssigneeUserName = x.AssigneeUserName,
            AssignerUserName = x.AssignerUserName,
            AssignmentDate = x.AssignmentDate,
            AssignmentState = x.AssignmentState,
            ReturnState = x.ReturnState,
          }).ToListAsync();

      var pagedResult = new PagingResult<AssignmentDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<AssignmentDTO> GetAssignmentById(int id)
    {
      var assignment = await _assetDBContext.AssignmentEntity.Include(x => x.Asset).Include(x => x.AssignUsers)
      .FirstOrDefaultAsync(x => x.AsmId == id && x.AsmState != (AsmState)2 && x.ReturnState != (ReturnState)2);
      AssignmentDTO result = null;
      if (assignment != null)
      {
        result = new AssignmentDTO
        {
          AssignmentId = assignment.AsmId,
          AssetCode = assignment.Asset.AssetCode,
          AssetName = assignment.Asset.AssetName,
          AssigneeUserName = assignment.AssignUsers.FirstOrDefault(a => a.Code == assignment.AssigneeCode),
          AssignerUserName = assignment.AssignUsers.FirstOrDefault(a => a.Code == assignment.AssignerCode),
          AssignmentDate = assignment.AssignedDate,
          AssignmentState = assignment.AsmState,
          ReturnState = assignment.ReturnState,
        };
      }

      return result;
    }
  }
}
