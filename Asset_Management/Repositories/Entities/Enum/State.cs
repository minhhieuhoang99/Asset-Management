using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asset_Management.Repositories.Entities
{
    public enum State
    {
      Available,
      NotAvailable,
      Assigned,
      WaitingForRecycling,
      Recycled
    }
}