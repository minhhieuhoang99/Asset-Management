using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Asset_Management.Repositories.Entities;

namespace Asset_Management.DTO
{
    public class AssetsEntityDTO
    {
        public int AssetId { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string Specification { get; set; }
        public string Location { get; set; }
        public int CategoryId { get; set; }
        public CategoriesEntity Category { get; set; }
        public DateTime InstalledDate { get; set; }
        public State State { get; set;}
        public string Prefix { get; set; }
        public List<AssignmentEntity> AssignmentList { get; set; }
    }
}