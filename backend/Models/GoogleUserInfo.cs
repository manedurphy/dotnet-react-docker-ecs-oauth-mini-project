namespace backend.Models
{
  public class GoogleUserInfo
  {
    public string given_name { get; set; }
    public string family_name { get; set; }
    public string email { get; set; }
    public string email_verified { get; set; }
    public string picture { get; set; }
  }
}