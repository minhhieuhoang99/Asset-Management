using System;
using System.Collections.Generic;
using Asset_Management.Repositories.Entities;
using Asset_Management.Repositories.EFContext;
using Asset_Management.DTO;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Asset_Management.Services.AdminService
{
  public class AdminService : IAdminService
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly ILogger<AdminService> _logger;
    private AssetDBContext _assetDBContext;
    public AdminService(
    UserManager<AppUser> userManager,
    AssetDBContext assetDBContext,
    ILogger<AdminService> logger
    )
    {
      _logger = logger;
      _userManager = userManager;
      _assetDBContext = assetDBContext;
    }
    public async Task<List<AppUserDTO>> GetUsersList(string location)
    {
      var listUsers = await _assetDBContext.AppUsers.Where(x => x.Location == location && x.IsDisabled == true).Select(x => new AppUserDTO
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
      return listUsers;
    }

    public AppUser GetByCode(string code) => _assetDBContext.AppUsers.Include(x => x.AssignmentList).Where(u => u.Code == code && u.IsDisabled == true).FirstOrDefault();
    public AppUserDTO GetUserInforByCode(string code)
    {

      AppUserDTO result = null;
      try
      {
        var user = GetByCode(code);
        var AsmList = user.AssignmentList.ToList();
        if (user == null) return null;
        result = new AppUserDTO()
        {
          Code = user.Code,
          FirstName = user.FirstName,
          LastName = user.LastName,
          Dob = user.Dob,
          JoinDate = user.JoinDate,
          Location = user.Location,
          Gender = user.Gender,
          UserName = user.UserName,
          Type = user.Type,
          IsDisabled = user.IsDisabled,
          AssignmentList = AsmList,
        };
        return result;
      }
      catch (Exception)
      {
        _logger.LogError("Couldn't find User");
      };
      return result;
    }
     
    public async Task<AppUserDTO> CreateUser(AppUserDTO user)
    {
      AppUserDTO result = null;

      var newUser = new AppUser
      {
        FirstName = user.FirstName,
        LastName = user.LastName,
        Dob = user.Dob,
        JoinDate = user.JoinDate,
        Location = user.Location,
        Gender = user.Gender,
        Code = user.Code,
        Type = user.Type,
        IsDisabled = true,
      };

      for (int i = 0; i < newUser.LastName.Split(' ').Length; i++)
      {
        newUser.LastNameFirstChar += newUser.LastName.Split(' ')[i][0];
      }
      newUser.CountDuplicate = _assetDBContext.AppUsers.Where(a => a.FirstName == newUser.FirstName && a.LastNameFirstChar == newUser.LastNameFirstChar).Count().ToString().ToLower();
      if (newUser.CountDuplicate == "0")
      {
        newUser.CountDuplicate = "";
      }

      if (newUser.Type == (Role)0)
      {
        user.Password = "Admin123@123";
      }
      else
      {
        user.Password = "Staff123@123";
      };
      var createdUser = await _userManager.CreateAsync(newUser, user.Password);
      _assetDBContext.AppUsers.Add(newUser);
      await _assetDBContext.SaveChangesAsync();

      string roleName = newUser.Type == (Role)0 ? "Admin" : "User";
      if (await _userManager.IsInRoleAsync(newUser, roleName) == false)
      {
        await _userManager.AddToRoleAsync(newUser, roleName);
      }
      result = new AppUserDTO()
      {
        FirstName = newUser.FirstName,
        LastName = newUser.LastName,
        Dob = newUser.Dob,
        JoinDate = newUser.JoinDate,
        Location = newUser.Location,
        Gender = newUser.Gender,
        Code = newUser.Code,
        UserName = newUser.UserName,
        Type = newUser.Type,
        IsDisabled = newUser.IsDisabled,
      };
      return result;
    }

    public async Task<AppUserDTO> UpdateUser(AppUserDTO user, string code)
    {
      using var transaction = _assetDBContext.Database.BeginTransaction();
      AppUserDTO result = null;
      try
      {
        var existingUser = GetByCode(code);
        if (existingUser == null || existingUser.IsFirstLogin == true )
        {
          if(user.Type != existingUser.Type){
          return null;
          }
        }
        else
        {
          TimeZone time2 = TimeZone.CurrentTimeZone;
          DateTime test = time2.ToUniversalTime(user.Dob);
          var sea = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
          var Dob = TimeZoneInfo.ConvertTimeFromUtc(test, sea);

          TimeZone time3 = TimeZone.CurrentTimeZone;
          DateTime test1 = time2.ToUniversalTime(user.JoinDate);
          var sea1 = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
          var JoinDate = TimeZoneInfo.ConvertTimeFromUtc(test1, sea);

          existingUser.Dob = Dob;
          existingUser.JoinDate = JoinDate;
          existingUser.Gender = user.Gender;
          _assetDBContext.Entry(existingUser).State = EntityState.Modified;

          string oldRoleName = existingUser.Type == (Role)0 ? "Admin" : "User";
          if (await _userManager.IsInRoleAsync(existingUser, oldRoleName))
          {
            await _userManager.RemoveFromRoleAsync(existingUser, oldRoleName);
          }
          existingUser.Type = user.Type;

          string newRoleName = user.Type == (Role)0 ? "Admin" : "User";
          if (!await _userManager.IsInRoleAsync(existingUser, newRoleName))
          {
            await _userManager.AddToRoleAsync(existingUser, newRoleName);
          }
          await _assetDBContext.SaveChangesAsync();
          await transaction.CommitAsync();
        }
        result = new AppUserDTO()
        {
          FirstName = existingUser.FirstName,
          LastName = existingUser.LastName,
          Dob = existingUser.Dob,
          JoinDate = existingUser.JoinDate,
          Location = existingUser.Location,
          Gender = existingUser.Gender,
          Code = existingUser.Code,
          UserName = existingUser.UserName,
          Type = existingUser.Type,
          IsDisabled = existingUser.IsDisabled,
        };
        return result;
      }
      catch
      {
        _logger.LogError("Couldn't Update User");
      }
      return result;
    }

    public async Task<bool> Disable(string code)
    {
      var user = GetByCode(code);
      if (user != null)
      {
        if (user.AssignmentList == null)
        {
          user.IsDisabled = false;
          await _assetDBContext.SaveChangesAsync();
          return true;
        }
        else if (user.AssignmentList != null)
        {
          foreach (var asm in user.AssignmentList)
          {
            if (asm.AsmState == (AsmState)1 && asm.ReturnState !=(ReturnState)2)
            {
              return false;
            }
          }
          user.IsDisabled = false;
          await _assetDBContext.SaveChangesAsync();
          return true;
        }
      }
      return false;
    }
  }
}