namespace backend.Models
{
  public class AuthResponse
  {
    public string Name { get; set; }
    public string Token { get; set; }
    public string RefreshToken { get; set; }

    public AuthResponse(string name, string token, string refreshToken)
    {
      Name = name;
      Token = token;
      RefreshToken = refreshToken;
    }
  }
}