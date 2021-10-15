using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Asset_Management.DTO;
using Asset_Management.DTO.Request;
using Asset_Management.Repositories.Entities;

namespace Asset_Management.Services.AssignmentService
{
    public interface IAdminAssignmentService
    {
        Task<PagingResult<AssignmentDTO>> ViewListAssignment(PagingRequest request, string location);
        Task<PagingResult<AssignmentDTO>> ViewListAssignmentByFields(PagingSearchRequest<string> request);
        Task<PagingResult<AssignmentDTO>> ViewListAssignmentByState(PagingSearchRequest<List<AsmState>> request);
        Task<PagingResult<AssignmentDTO>> ViewListAssignmentByAsmDate(PagingSearchRequest<DateTime> request);
        Task<AssignmentDTO> GetAssignmentById(int id);
        Task<AssignmentDTO> CreateAssignment(AssignmentDTO assignment);
        Task<AssignmentDTO> UpdateAssignment(AssignmentDTO assignment, int id);
        Task<bool> DeleteAssignment(int id);
        Task<PagingResult<ReturnRequestDTO>> ViewListReturnRequest(PagingRequest request, string location);
        Task<PagingResult<ReturnRequestDTO>> ViewListReturnRequestByFields(PagingSearchRequest<string> request);
        Task<PagingResult<ReturnRequestDTO>> ViewListReturnRequestByState(PagingSearchRequest<List<ReturnState>> request);
        Task<PagingResult<ReturnRequestDTO>> ViewListReturnRequestByReturnDate(PagingSearchRequest<DateTime> request);
        Task<ReturnRequestDTO> AdminRespondReturnRequest(string code,int id, string respond);
    }
}