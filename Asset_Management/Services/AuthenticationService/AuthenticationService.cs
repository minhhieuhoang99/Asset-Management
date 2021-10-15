using System;
using Asset_Management.DTO.Request;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Threading.Tasks;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Asset_Management.Repositories.Entities;
using Asset_Management.Repositories.EFContext;
using Microsoft.Extensions.Logging;

namespace Asset_Management.Services.AuthenticationService
{
  public class AuthenticationService : IAuthenticationService
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly RoleManager<AppRole> _roleManager;
    private readonly IConfiguration _config;
    private AssetDBContext _assetDBContext;
    private ILogger<AuthenticationService> _logger;
    public AuthenticationService(UserManager<AppUser> userManager,
     SignInManager<AppUser> signInManager,
     RoleManager<AppRole> roleManager,
     IConfiguration config,
     AssetDBContext assetDBContext,
     ILogger<AuthenticationService> logger)
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _roleManager = roleManager;
      _config = config;
      _assetDBContext = assetDBContext;
      _logger = logger;
    }
    public async Task<string[]> Authenticate(LoginRequest request)
    {
      using var transaction = _assetDBContext.Database.BeginTransaction();
      var result = new string[6];
      try
      {
        var user = await _userManager.FindByNameAsync(request.UserName);
        if (user == null || user.IsDisabled == false) throw new Exception("Can't find User Name");
        var login = await _signInManager.PasswordSignInAsync(user, request.Password, request.RememberMe, true);
        if (!login.Succeeded)
        {
          return null;
        }

        var roles = await _userManager.GetRolesAsync(user);
        var claims = new[]
        {
          new Claim(ClaimTypes.Locality, user.Location),
          new Claim(ClaimTypes.Role, string.Join(";", roles)),
          new Claim(ClaimTypes.UserData, user.Code),
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(_config["Tokens:Issuer"],
            _config["Tokens:Issuer"],
            claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials);

        result[0] = new JwtSecurityTokenHandler().WriteToken(token);
        result[1] = string.Join(";", roles);
        result[2] = string.Join(";", user.IsFirstLogin);
        result[3] = string.Join(";", user.Location);
        result[4] = string.Join(";", user.Code);
        result[5] = string.Join(";", user.UserName);
        await _assetDBContext.SaveChangesAsync();
        await transaction.CommitAsync();
      }
      catch
      {
        _logger.LogError("Couldn't connect database");
      }
      return result;
    }

    public AppUser GetByCode(string code) => _assetDBContext.AppUsers.FirstOrDefault(u => u.Code == code && u.IsDisabled == true);

    public async Task<string> ChangePassword(ChangePasswordRequest request)
    { 
      var findUser = GetByCode(request.UserCode);
      if (findUser != null)
      {
        var result = _userManager.PasswordHasher.VerifyHashedPassword(findUser, findUser.PasswordHash, request.OldPassword);
        if (result != PasswordVerificationResult.Success)
        {
          return "Wrong Password";
        }
        findUser.IsFirstLogin = false;
        var changePass = await _userManager.ChangePasswordAsync(findUser, request.OldPassword, request.NewPassword);
        if (changePass.Succeeded) return "Success";
        return "Fail";
      }
      return null;
    }
  }
}