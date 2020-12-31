using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
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
        Expires = DateTime.UtcNow.AddMinutes(10),
        SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
      Random random = new Random();
      byte[] buffer = new byte[80];

      random.NextBytes(buffer);
      string result = String.Concat(buffer.Select(x => x.ToString("X2")).ToArray());

      return result + random.Next(16).ToString();

    }
  }
}