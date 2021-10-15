
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Asset_Management.DTO.Request;

namespace Asset_Management.Services.AuthenticationService
{
  public interface IAuthenticationService
  {
    Task<string[]> Authenticate(LoginRequest request);
    Task<string> ChangePassword(ChangePasswordRequest request);
  }
}