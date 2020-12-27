namespace backend.Models
{
  public class AuthResponse
  {
    public string Name { get; set; }
    public string Email { get; set; }
    public string Token { get; set; }
    public string RefreshToken { get; set; }

    public AuthResponse(string name, string email, string token, string refreshToken)
    {
      Name = name;
      Email = email;
      Token = token;
      RefreshToken = refreshToken;
    }
  }
}