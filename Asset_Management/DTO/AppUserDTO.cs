using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Asset_Management.Repositories.Entities;

namespace Asset_Management.DTO
{
    public class AppUserDTO
    {
        public string Code { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime Dob { get; set; }
        public DateTime JoinDate { get; set; }
        public string Location { get; set;}
        public string Gender { get; set; }
        public string UserName { get; set; }
        public Role Type { get; set; }
        public bool IsDisabled { get; set; }
        public List<AssignmentEntity> AssignmentList { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}