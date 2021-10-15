using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asset_Management.DTO
{
  public class ReportEntityDTO
  {   
    public string CategoryName { get; set; }
    public int TotalCount  { get; set; }
    public int AssignedCount { get; set; }
    public int AvailableCount { get; set; }
    public int NotAvailableCount { get; set; }
    public int WaitingCount { get; set; }
    public int RecycledCount { get; set; }
  }
}