using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class WeatherForecastController : ControllerBase
  {
    private static readonly string[] Summaries = new[]
    {
      "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };
    private readonly string UserId = "5fe7ff5fce1c2531279fa464";

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
      _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public IEnumerable<WeatherForecast> Get()
    {
      // var token = GenerateToken();
      // Console.WriteLine(token);
      // Console.WriteLine(ValidateToken(token));
      // Console.WriteLine(GetClaim(token, "UserRole"));
      var rng = new Random();
      return Enumerable.Range(1, 5).Select(index => new WeatherForecast
      {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = rng.Next(-20, 55),
        Summary = Summaries[rng.Next(Summaries.Length)]
      })
      .ToArray();
    }

    private string GenerateToken()
    {
      var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
      var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));

      var myIssuer = "http://localhost:8080";
      var myAudience = "http://localhost:5500";

      var tokenHandler = new JwtSecurityTokenHandler();
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new Claim[]
        {
          new Claim(ClaimTypes.NameIdentifier, UserId.ToString()),
          new Claim("UserRole", "Administrator")
        }),
        Expires = DateTime.UtcNow.AddDays(7),
        Issuer = myIssuer,
        Audience = myAudience,
        SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }

    private bool ValidateToken(string token)
    {
      var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
      var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));

      var myIssuer = "http://localhost:8080";
      var myAudience = "http://localhost:5500";

      var tokenHandler = new JwtSecurityTokenHandler();
      try
      {
        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
          ValidateIssuerSigningKey = true,
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidIssuer = myIssuer,
          ValidAudience = myAudience,
          IssuerSigningKey = mySecurityKey
        }, out SecurityToken validatedToken);
      }
      catch
      {
        return false;
      }
      return true;
    }

    private string GetClaim(string token, string ClaimType)
    {
      var tokenHandler = new JwtSecurityTokenHandler();
      var securityToken = tokenHandler.ReadJwtToken(token) as JwtSecurityToken;

      var stringClaimValue = securityToken.Claims.First(claim => claim.Type == ClaimType).Value;
      return stringClaimValue;
    }
  }
}
