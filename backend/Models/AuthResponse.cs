namespace backend.Models
{
  public class AuthResponse
  {
    public string Name { get; set; }
    public string Token { get; set; }

    public AuthResponse(string name, string token)
    {
      Name = name;
      Token = token;
    }
  }
}