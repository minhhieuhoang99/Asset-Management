using System;
using Asset_Management.Repositories.Entities;

namespace Asset_Management.DTO
{
  public class ReturnRequestDTO
  {
    public int AssignmentId { get; set; }
    public string AssetCode { get; set; }
    public string AssetName { get; set; }
    public AppUser RequesterUserName { get; set; }
    public AppUser VerifierUserName { get; set; }
    public DateTime AssignmentDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public ReturnState ReturnState { get; set; }
  }
}