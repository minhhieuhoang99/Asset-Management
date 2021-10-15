using System.Collections.Generic;
using Asset_Management.Repositories.Entities;
using Asset_Management.DTO;
using System.Threading.Tasks;
namespace Asset_Management.Services.AdminService
{
  public interface IAdminService
  {
    AppUser GetByCode(string code);
    AppUserDTO GetUserInforByCode(string code);
    Task<AppUserDTO> CreateUser(AppUserDTO user);
    Task<AppUserDTO> UpdateUser(AppUserDTO user, string code);
    Task<bool> Disable(string code);
    Task<List<AppUserDTO>> GetUsersList(string location);
  }
}
