using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Asset_Management.Repositories.Entities;

namespace Asset_Management.DTO
{
  public class AssignmentDTO
  {
    public int AssignmentId { get; set; }
    public string AssetCode { get; set; }
    public string AssetName { get; set; }
    public AppUser AssigneeUserName { get; set; }
    public AppUser AssignerUserName { get; set; }
    public AppUser RequesterUserName { get; set; }
    public AppUser VerifierUserName { get; set;}
    [DataType(DataType.Date)]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    [Column(TypeName = "Date")]
    public DateTime AssignmentDate { get; set; }
    public AsmState AssignmentState { get; set; }
    public string AssigneeCode { get; set; }
    public string AssignerCode { get; set; }
    public string VerifierCode { get; set; }
    public string RequesterCode { get; set; }
    public string Note { get; set; }
    [DataType(DataType.Date)]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    [Column(TypeName = "Date")]
    public DateTime ReturnDate { get; set; }
    public ReturnState ReturnState { get; set; }
  }
}