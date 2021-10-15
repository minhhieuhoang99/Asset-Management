using System.Collections.Generic;
using Asset_Management.DTO.Request;
namespace Asset_Management.DTO.Request
{
  public class PagingResult<T> : PagingRequest
  {
    public List<T> Items { get; set; }
  }
}