using System;
using System.Collections.Generic;
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
  public class AdminAssignmentService : IAdminAssignmentService
  {
    private AssetDBContext _assetDBContext;
    private readonly ILogger<AdminAssignmentService> _logger;
    public AdminAssignmentService(AssetDBContext assetDBContext, ILogger<AdminAssignmentService> logger)
    {
      _assetDBContext = assetDBContext;
      _logger = logger;
    }

    public async Task<AssignmentDTO> GetAssignmentById(int id)
    {
      var assignment = await _assetDBContext.AssignmentEntity.Include(x => x.Asset).AsSingleQuery().Include(x => x.AssignUsers).AsSingleQuery()
      .FirstOrDefaultAsync(x => x.AsmId == id && x.ReturnState != (ReturnState)2);
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

    public async Task<PagingResult<AssignmentDTO>> ViewListAssignment(PagingRequest request, string location)
    {
      var locationUsers = await _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == location)
                          .Select(x => x.Code).ToListAsync();
      var assignmentList = _assetDBContext.AssignmentEntity.Include(x => x.Asset).AsSingleQuery().Include(x => x.AssignUsers).AsSingleQuery()
      .Where(x => x.ReturnState != (ReturnState)2 && locationUsers.Contains(x.AssignerCode)).Select(x => new AssignmentDTO
      {
        AssignmentId = x.AsmId,
        AssetCode = x.Asset == null ? string.Empty : x.Asset.AssetCode,
        AssetName = x.Asset == null ? string.Empty : x.Asset.AssetName,
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
    public async Task<PagingResult<AssignmentDTO>> ViewListAssignmentByFields(PagingSearchRequest<string> request)
    {
      var locationUsers = await _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == request.Location).ToListAsync();
      var userSameLocation = locationUsers.Select(x => x.Code).ToList();
      var usersFilter = locationUsers.Where(x => x.UserName.Contains(request.SearchValue)).Select(x => x.Code).ToList();


      var assignmentList = _assetDBContext.AssignmentEntity.Include(x => x.Asset).AsSingleQuery()
                          .Include(x => x.AssignUsers).AsSingleQuery()
                          .Where(x => (usersFilter.Contains(x.AssigneeCode) || x.Asset.AssetName.Contains(request.SearchValue)
                          || x.Asset.AssetCode.Contains(request.SearchValue))
                          && x.ReturnState != (ReturnState)2 && userSameLocation.Contains(x.AssignerCode))
                          .Select(x => new AssignmentDTO
                          {
                            AssignmentId = x.AsmId,
                            AssetCode = x.Asset == null ? string.Empty : x.Asset.AssetCode,
                            AssetName = x.Asset == null ? string.Empty : x.Asset.AssetName,
                            AssigneeUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.AssigneeCode),
                            AssignerUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.AssignerCode),
                            AssignmentDate = x.AssignedDate,
                            AssignmentState = x.AsmState,
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

    public async Task<PagingResult<AssignmentDTO>> ViewListAssignmentByState(PagingSearchRequest<List<AsmState>> request)
    {
      var locationUsers = await _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == request.Location)
                          .Select(x => x.Code).ToListAsync();
      var assignmentList = _assetDBContext.AssignmentEntity.Include(x => x.Asset).AsSingleQuery()
                          .Include(x => x.AssignUsers).AsSingleQuery()
                          .Where(x => x.ReturnState != (ReturnState)2 && locationUsers.Contains(x.AssignerCode) && request.SearchValue.Contains(x.AsmState))
                          .Select(x => new AssignmentDTO
                          {
                            AssignmentId = x.AsmId,
                            AssetCode = x.Asset == null ? string.Empty : x.Asset.AssetCode,
                            AssetName = x.Asset == null ? string.Empty : x.Asset.AssetName,
                            AssigneeUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.AssigneeCode),
                            AssignerUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.AssignerCode),
                            AssignmentDate = x.AssignedDate,
                            AssignmentState = x.AsmState,
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

    public async Task<PagingResult<AssignmentDTO>> ViewListAssignmentByAsmDate(PagingSearchRequest<DateTime> request)
    {
      var locationUsers = await _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == request.Location)
                          .Select(x => x.Code).ToListAsync();
      var assignmentList = _assetDBContext.AssignmentEntity.Include(x => x.Asset).AsSingleQuery()
                          .Include(x => x.AssignUsers).AsSingleQuery()
                          .Where(x => x.ReturnState != (ReturnState)2 && locationUsers.Contains(x.AssignerCode)
                          && x.AssignedDate.Date == request.SearchValue.Date)
                          .Select(x => new AssignmentDTO
                          {
                            AssignmentId = x.AsmId,
                            AssetCode = x.Asset == null ? string.Empty : x.Asset.AssetCode,
                            AssetName = x.Asset == null ? string.Empty : x.Asset.AssetName,
                            AssigneeUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.AssigneeCode),
                            AssignerUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.AssignerCode),
                            AssignmentDate = x.AssignedDate,
                            AssignmentState = x.AsmState,
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

    public AppUser GetAUByCode(string code) => _assetDBContext.AppUsers.Include(x => x.AssignmentList).Where(u => u.Code == code && u.IsDisabled == true).FirstOrDefault();
    public AssetsEntity GetASByCode(string code) => _assetDBContext.AssetsEntity
    .Include(x => x.Category).Include(x => x.AssignmentList).ThenInclude(x => x.AssignUsers)
    .Where(u => u.AssetCode == code).FirstOrDefault();

    public async Task<AssignmentDTO> CreateAssignment(AssignmentDTO assignment)
    {
      AssignmentEntity newAssignment = null;
      AssignmentDTO result = null;
      var Assignee = GetAUByCode(assignment.AssigneeCode);
      var Assigner = GetAUByCode(assignment.AssignerCode);
      AssetsEntity assetAssignment = GetASByCode(assignment.AssetCode);
      if (assetAssignment.State == (State)2)
      {
        return null;
      }
      List<AppUser> userList = new List<AppUser>();
      userList.Add(Assignee);

      using var transaction = _assetDBContext.Database.BeginTransaction();
      try
      {
        newAssignment = new AssignmentEntity
        {
          // AsmId = assignment.AsmId,
          AssignUsers = userList,
          Asset = assetAssignment,
          AssignedDate = assignment.AssignmentDate,
          Note = assignment.Note,
          AsmState = (AsmState)0,
          AssigneeCode = assignment.AssigneeCode,
          AssignerCode = assignment.AssignerCode,
          ReturnState = (ReturnState)0,

        };
        assetAssignment.State = (State)2;
        _assetDBContext.AssignmentEntity.Add(newAssignment);
        await _assetDBContext.SaveChangesAsync();
        // await transaction.CommitAsync();
        // userList.Add(Assigner);
        // var existingAssignment = await _assetDBContext.AssignmentEntity.Include(x => x.Asset).Include(x => x.AssignUsers)
        // .FirstOrDefaultAsync(x => x.AsmId == newAssignment.AsmId);
        // existingAssignment.AssignUsers = userList;
        newAssignment.AssignUsers.Add(Assigner);
        _assetDBContext.Entry(newAssignment).State = EntityState.Modified;
        await _assetDBContext.SaveChangesAsync();
        await transaction.CommitAsync();
        result = new AssignmentDTO()
        {
          AssignmentId = newAssignment.AsmId,
          AssetCode = assignment.AssetCode,
          AssignmentDate = assignment.AssignmentDate,
          Note = assignment.Note,
          AssignmentState = assignment.AssignmentState,
          AssigneeCode = assignment.AssigneeCode,
          AssignerCode = assignment.AssignerCode,
        };
        return result;

      }
      catch
      {
        _logger.LogError("Couldn't Create Assignment");
      }
      return result;
    }
    public async Task<AssignmentDTO> UpdateAssignment(AssignmentDTO assignment, int id)
    {
      using var transaction = _assetDBContext.Database.BeginTransaction();
      AssignmentDTO result = null;
      try
      {
        var existingAssignment = await _assetDBContext.AssignmentEntity.Include(x => x.Asset).Include(x => x.AssignUsers)
        .FirstOrDefaultAsync(x => x.AsmId == id);
        if (existingAssignment == null)
        {
          return null;
        }
        else
        {
          // AssignmentEntity newAssignment = null;
          // AssignmentDTO result = null;
          var Assignee = GetAUByCode(assignment.AssigneeCode);
          var Assigner = GetAUByCode(assignment.AssignerCode);
          AssetsEntity assetBeforeEdit = GetASByCode(existingAssignment.Asset.AssetCode);
          AssetsEntity assetAssignment = GetASByCode(assignment.AssetCode);
          List<AppUser> userList = new List<AppUser>();
          userList.Add(Assignee);
          userList.Add(Assigner);
          existingAssignment.AssignUsers = userList;
          existingAssignment.Asset = assetAssignment;
          existingAssignment.AssignedDate = assignment.AssignmentDate;
          existingAssignment.Note = assignment.Note;
          existingAssignment.AsmState = assignment.AssignmentState;
          existingAssignment.AssigneeCode = assignment.AssigneeCode;
          existingAssignment.AssignerCode = assignment.AssignerCode;
          assetBeforeEdit.State = (State)0;
          assetAssignment.State = (State)2;
          _assetDBContext.Entry(existingAssignment).State = EntityState.Modified;
          await _assetDBContext.SaveChangesAsync();
          await transaction.CommitAsync();
        }
        result = new AssignmentDTO()
        {
          AssignmentId = existingAssignment.AsmId,
          AssetCode = existingAssignment.Asset.AssetCode,
          AssignmentDate = existingAssignment.AssignedDate,
          Note = existingAssignment.Note,
          AssignmentState = existingAssignment.AsmState,
          AssigneeCode = existingAssignment.AssigneeCode,
          AssignerCode = existingAssignment.AssignerCode,
        };
        return result;
      }
      catch
      {
        _logger.LogError("Couldn't Update Assignment");
      }
      return result;
    }

    public async Task<bool> DeleteAssignment(int id)
    {
      using var transaction = await _assetDBContext.Database.BeginTransactionAsync();
      try
      {
        var deleteAssignment = await _assetDBContext.AssignmentEntity.Include(x => x.AssignUsers).AsSingleQuery()
                          .Include(x => x.Asset).AsSingleQuery()
              .FirstOrDefaultAsync(x => x.AsmId == id);
        if (deleteAssignment == null || deleteAssignment.AsmState == (AsmState)1)
        {
          return false;
        }
        deleteAssignment.Asset.State = (State)0;
        deleteAssignment.AssignUsers = null;
        _assetDBContext.AssignmentEntity.Remove(deleteAssignment);
        _assetDBContext.SaveChanges();
        await transaction.CommitAsync();
        return true;
      }
      catch
      {
        _logger.LogError("Error");
      }
      return false;
    }


    public async Task<PagingResult<ReturnRequestDTO>> ViewListReturnRequest(PagingRequest request, string location)
    {
      var locationUsers = await _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == location)
                    .Select(x => x.Code).ToListAsync();
      var returnRequestList = _assetDBContext.AssignmentEntity.Include(x => x.Asset).AsSingleQuery().Include(x => x.AssignUsers).AsSingleQuery()
      .Where(x => x.ReturnState != (ReturnState)0 && locationUsers.Contains(x.AssignerCode)).Select(x => new ReturnRequestDTO
      {
        AssignmentId = x.AsmId,
        AssetCode = x.Asset == null ? string.Empty : x.Asset.AssetCode,
        AssetName = x.Asset == null ? string.Empty : x.Asset.AssetName,
        RequesterUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.RequesterCode),
        VerifierUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.VerifierCode),
        AssignmentDate = x.AssignedDate,
        ReturnState = x.ReturnState,
        ReturnDate = x.ReturnDate,
      });

      int totalRow = await returnRequestList.CountAsync();

      var data = await returnRequestList.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new ReturnRequestDTO()
          {
            AssignmentId = x.AssignmentId,
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            RequesterUserName = x.RequesterUserName,
            VerifierUserName = x.VerifierUserName,
            AssignmentDate = x.AssignmentDate,
            ReturnState = x.ReturnState,
            ReturnDate = x.ReturnDate,
          }).ToListAsync();

      var pagedResult = new PagingResult<ReturnRequestDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<PagingResult<ReturnRequestDTO>> ViewListReturnRequestByFields(PagingSearchRequest<string> request)
    {
      var locationUsers = await _assetDBContext.AppUsers.
                          Where(x => x.IsDisabled == true && x.Location == request.Location).ToListAsync();
      var userSameLocation = locationUsers.Select(x => x.Code).ToList();
      var usersFilter = locationUsers.Where(x => x.UserName.Contains(request.SearchValue)).Select(x => x.Code).ToList();

      var returnRequestList = _assetDBContext.AssignmentEntity.Include(x => x.Asset).AsSingleQuery().Include(x => x.AssignUsers).AsSingleQuery()
                                .Where(x => (usersFilter.Contains(x.RequesterCode) || x.Asset.AssetName.Contains(request.SearchValue)
                                || x.Asset.AssetCode.Contains(request.SearchValue))
                                && x.ReturnState != (ReturnState)0 && userSameLocation.Contains(x.AssignerCode))
                                .Select(x => new ReturnRequestDTO
                                {
                                  AssignmentId = x.AsmId,
                                  AssetCode = x.Asset == null ? string.Empty : x.Asset.AssetCode,
                                  AssetName = x.Asset == null ? string.Empty : x.Asset.AssetName,
                                  RequesterUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.RequesterCode),
                                  VerifierUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.VerifierCode),
                                  AssignmentDate = x.AssignedDate,
                                  ReturnState = x.ReturnState,
                                  ReturnDate = x.ReturnDate,
                                });

      int totalRow = await returnRequestList.CountAsync();

      var data = await returnRequestList.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new ReturnRequestDTO()
          {
            AssignmentId = x.AssignmentId,
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            RequesterUserName = x.RequesterUserName,
            VerifierUserName = x.VerifierUserName,
            AssignmentDate = x.AssignmentDate,
            ReturnState = x.ReturnState,
            ReturnDate = x.ReturnDate,
          }).ToListAsync();

      var pagedResult = new PagingResult<ReturnRequestDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<PagingResult<ReturnRequestDTO>> ViewListReturnRequestByState(PagingSearchRequest<List<ReturnState>> request)
    {
      var locationUsers = await _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == request.Location)
                    .Select(x => x.Code).ToListAsync();
      var returnRequestList = _assetDBContext.AssignmentEntity.Include(x => x.Asset).AsSingleQuery().Include(x => x.AssignUsers).AsSingleQuery()
                                .Where(x => x.ReturnState != (ReturnState)0 && locationUsers.Contains(x.AssignerCode)
                                && request.SearchValue.Contains(x.ReturnState))
                                .Select(x => new ReturnRequestDTO
                                {
                                  AssignmentId = x.AsmId,
                                  AssetCode = x.Asset == null ? string.Empty : x.Asset.AssetCode,
                                  AssetName = x.Asset == null ? string.Empty : x.Asset.AssetName,
                                  RequesterUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.RequesterCode),
                                  VerifierUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.VerifierCode),
                                  AssignmentDate = x.AssignedDate,
                                  ReturnState = x.ReturnState,
                                  ReturnDate = x.ReturnDate,
                                });

      int totalRow = await returnRequestList.CountAsync();

      var data = await returnRequestList.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new ReturnRequestDTO()
          {
            AssignmentId = x.AssignmentId,
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            RequesterUserName = x.RequesterUserName,
            VerifierUserName = x.VerifierUserName,
            AssignmentDate = x.AssignmentDate,
            ReturnState = x.ReturnState,
            ReturnDate = x.ReturnDate,
          }).ToListAsync();

      var pagedResult = new PagingResult<ReturnRequestDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<PagingResult<ReturnRequestDTO>> ViewListReturnRequestByReturnDate(PagingSearchRequest<DateTime> request)
    {
      var locationUsers = await _assetDBContext.AppUsers.Where(x => x.IsDisabled == true && x.Location == request.Location)
                    .Select(x => x.Code).ToListAsync();
      var returnRequestList = _assetDBContext.AssignmentEntity.Include(x => x.Asset).AsSingleQuery().Include(x => x.AssignUsers).AsSingleQuery()
                                .Where(x => x.ReturnState != (ReturnState)0 && locationUsers.Contains(x.AssignerCode)
                                && x.ReturnDate.Date == request.SearchValue.Date)
                                .Select(x => new ReturnRequestDTO
                                {
                                  AssignmentId = x.AsmId,
                                  AssetCode = x.Asset == null ? string.Empty : x.Asset.AssetCode,
                                  AssetName = x.Asset == null ? string.Empty : x.Asset.AssetName,
                                  RequesterUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.RequesterCode),
                                  VerifierUserName = x.AssignUsers.FirstOrDefault(a => a.Code == x.VerifierCode),
                                  AssignmentDate = x.AssignedDate,
                                  ReturnState = x.ReturnState,
                                  ReturnDate = x.ReturnDate,
                                });

      int totalRow = await returnRequestList.CountAsync();

      var data = await returnRequestList.Skip((request.PageIndex - 1) * request.PageSize)
          .Take(request.PageSize)
          .Select(x => new ReturnRequestDTO()
          {
            AssignmentId = x.AssignmentId,
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            RequesterUserName = x.RequesterUserName,
            VerifierUserName = x.VerifierUserName,
            AssignmentDate = x.AssignmentDate,
            ReturnState = x.ReturnState,
            ReturnDate = x.ReturnDate,
          }).ToListAsync();

      var pagedResult = new PagingResult<ReturnRequestDTO>()
      {
        Items = data,
        TotalRecords = totalRow,
        PageSize = request.PageSize,
        PageIndex = request.PageIndex,
      };

      return pagedResult;
    }

    public async Task<ReturnRequestDTO> AdminRespondReturnRequest(string code, int id, string respond)
    {
      using var transaction = _assetDBContext.Database.BeginTransaction();
      ReturnRequestDTO result = null;
      try
      {
        var existingReturnRequest = await _assetDBContext.AssignmentEntity.Include(x => x.Asset).Include(x => x.AssignUsers).FirstOrDefaultAsync(x => x.AsmId == id);
        var existedAsset = await _assetDBContext.AssetsEntity.FirstOrDefaultAsync(x => x.AssetCode == existingReturnRequest.Asset.AssetCode);
        var verifier = GetAUByCode(code);
        if (existingReturnRequest == null)
        {
          return null;
        }
        else if (existingReturnRequest.ReturnState == (ReturnState)1 && respond == "Completed")
        {
          TimeZone time2 = TimeZone.CurrentTimeZone;
          DateTime test = time2.ToUniversalTime(DateTime.Now);
          var sea = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
          var seatime = TimeZoneInfo.ConvertTimeFromUtc(test, sea);
          existedAsset.State = (State)0;
          existingReturnRequest.ReturnState = (ReturnState)2;
          existingReturnRequest.ReturnDate = seatime;
          existingReturnRequest.VerifierCode = code;
          existingReturnRequest.AssignUsers.Add(verifier);
          await _assetDBContext.SaveChangesAsync();
          await transaction.CommitAsync();
        }
        else if (existingReturnRequest.ReturnState == (ReturnState)1 && respond == "Cancel")
        {
          existingReturnRequest.ReturnState = (ReturnState)0;
          existingReturnRequest.RequesterCode = null;
          existingReturnRequest.VerifierCode = null;
          await _assetDBContext.SaveChangesAsync();
          await transaction.CommitAsync();
        }
        else
        {
          _logger.LogError("Couldn't create respond for returning this Assignment");
          return null;
        }
        result = new ReturnRequestDTO()
        {
          AssignmentId = existingReturnRequest.AsmId,
          AssetCode = existingReturnRequest.Asset == null ? string.Empty : existingReturnRequest.Asset.AssetCode,
          AssetName = existingReturnRequest.Asset == null ? string.Empty : existingReturnRequest.Asset.AssetName,
          RequesterUserName = existingReturnRequest.AssignUsers.FirstOrDefault(a => a.Code == existingReturnRequest.RequesterCode),
          VerifierUserName = existingReturnRequest.AssignUsers.FirstOrDefault(a => a.Code == existingReturnRequest.VerifierCode),
          AssignmentDate = existingReturnRequest.AssignedDate,
          ReturnState = existingReturnRequest.ReturnState,
          ReturnDate = existingReturnRequest.ReturnDate,
        };
        return result;
      }
      catch
      {
        _logger.LogError("Couldn't create respond for returning this Assignment");
      }
      return result;

    }
  }
}