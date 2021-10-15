using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asset_Management.Repositories.Entities
{
    public enum ReturnState
    {   
      Unknow,
      WaitingForReturning,
      Completed,
    }
}