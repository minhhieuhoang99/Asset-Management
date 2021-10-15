using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asset_Management.Repositories.Entities
{
    public class AssetsEntity
    {    
        [Key, ForeignKey("AssetId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AssetId { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public int CategoryId { get; set; }
        public string Location { get; set; }
        public string Prefix { get; set; }
        public CategoriesEntity Category { get; set; }
        public string Specification { get; set; }
        public int CountPrefix { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime InstalledDate { get; set; }
        public State State { get; set; }
        public List<AssignmentEntity> AssignmentList { get; set; }
    }
}