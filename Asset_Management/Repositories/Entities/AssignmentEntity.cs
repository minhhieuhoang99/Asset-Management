using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asset_Management.Repositories.Entities
{
  public class AssignmentEntity
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AsmId { get; set; }
    public List<AppUser> AssignUsers { get; set; }
    public AssetsEntity Asset { get; set; }
    [DataType(DataType.Date)]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    [Column(TypeName = "Date")]
    public DateTime AssignedDate { get; set; }
    public string Note { get; set; }
    public AsmState AsmState { get; set; }
    public string AssigneeCode { get; set; }
    public string AssignerCode { get; set; }
    public string RequesterCode { get; set; }
    public string VerifierCode { get; set; }
    [DataType(DataType.Date)]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    [Column(TypeName = "Date")]
    public DateTime ReturnDate { get; set; }
    public ReturnState ReturnState { get; set; }
  }
}