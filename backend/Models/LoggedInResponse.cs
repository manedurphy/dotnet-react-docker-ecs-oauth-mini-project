namespace backend.Models
{
  public class LoggedInResponse
  {
    public string Name { get; set; }
    public string Email { get; set; }

    public LoggedInResponse(string name, string email)
    {
      Name = name;
      Email = email;
    }
  }
}