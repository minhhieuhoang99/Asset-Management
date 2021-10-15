using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Asset_Management.Repositories.Entities;
using Microsoft.AspNetCore.Identity;

namespace Asset_Management.Repositories.Entities
{
  public class AppUser : IdentityUser<int>
  {
    public string Code { get; set; }
    public string Location { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    [DataType(DataType.Date)]
    public DateTime Dob { get; set; }
    [DataType(DataType.Date)]
    public DateTime JoinDate { get; set; }
    public string Gender { get; set; }
    public Role Type { get; set; }
    public bool IsDisabled { get; set; }
    public List<AssignmentEntity> AssignmentList { get; set; }
    public string CountDuplicate { get; set; }
    public string LastNameFirstChar { get; set; }
    public bool IsFirstLogin { get; set; }
  }
}