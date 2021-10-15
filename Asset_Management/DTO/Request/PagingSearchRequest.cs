namespace Asset_Management.DTO.Request
{
  public class PagingSearchRequest<T> : PagingRequest
  {
    public T SearchValue { get; set; }
    public string Location { get; set; }
  }
}