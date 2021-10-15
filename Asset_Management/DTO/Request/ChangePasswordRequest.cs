namespace Asset_Management.DTO.Request
{
  public class ChangePasswordRequest
  {
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
    public string UserCode { get; set; }
  }
}