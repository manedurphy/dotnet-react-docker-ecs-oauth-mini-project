using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
  public interface ITokenService
  {
    string GenerateToken(string UserId);
    string GenerateRefreshToken();
  }
  public class TokenService : ITokenService
  {
    public string GenerateToken(string UserId)
    {
      var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
      var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));

      var tokenHandler = new JwtSecurityTokenHandler();
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new Claim[]
        {
          new Claim(ClaimTypes.NameIdentifier, UserId.ToString())
        }),
        Expires = DateTime.UtcNow.AddDays(7),
        SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
      var randomNumber = new byte[32];
      using (var range = RandomNumberGenerator.Create())
      {
        range.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
      }
    }
  }
}