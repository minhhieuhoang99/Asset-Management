using System.Collections.Generic;
using Asset_Management.Repositories.Entities;
using Asset_Management.DTO;
using System.Threading.Tasks;

namespace Asset_Management.Services.ReportService
{
    public interface IReportService
    {
        Task<List<ReportEntityDTO>> GetAssetsListByCategory(string location);
    }
}
