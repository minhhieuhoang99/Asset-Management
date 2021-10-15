using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace  Asset_Management.DTO.Request
{
  public class PagingRequest
  {
    public int PageIndex { get; set; }
    [Required]
    public int PageSize { get; set; }
    public int TotalRecords { get; set; }

    public int PageCount
    {
      get
      {
        var pageCount = (double)TotalRecords / PageSize;
        return (int)Math.Ceiling(pageCount);
      }
    }
  }
}