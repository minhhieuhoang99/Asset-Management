using System.Threading.Tasks;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Asset_Management.Repositories.Entities;

namespace Asset_Management.Services.AssignmentService
{
    public interface IUserAssignmentService
    {   
        AppUser GetAUByCode(string code);
        Task<PagingResult<AssignmentDTO>> ViewOwnAssignment(PagingRequest request, string userCode);
        Task<AssignmentDTO> GetAssignmentById(int id);
        Task<AssignmentDTO> CreateReturnRequest(int id, string code);
        Task<AssignmentDTO> RespondAssignment(int id, string respond);
        AssetsEntity GetASByCode(string code);
    }
}