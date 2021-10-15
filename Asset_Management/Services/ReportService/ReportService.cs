using System.Collections.Generic;
using Asset_Management.Repositories.Entities;
using Asset_Management.Services.AssetService;
using Asset_Management.Services.CategoriesService;
using Asset_Management.DTO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Asset_Management.Repositories.EFContext;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Asset_Management.Services.ReportService
{
    public class ReportService : IReportService
    {
        private readonly ILogger<ReportService> _logger;
        private AssetDBContext _assetDBContext;
        public ReportService(AssetDBContext assetDBContext,
        ILogger<ReportService> logger)
        {
            _logger = logger;
            _assetDBContext = assetDBContext;
        }
        public async Task<List<ReportEntityDTO>> GetAssetsListByCategory(string location)
        {
            using var transaction = _assetDBContext.Database.BeginTransaction();
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

            return listDTO;
        }
    }
}
