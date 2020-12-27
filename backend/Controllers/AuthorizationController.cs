using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using backend.Services;
using backend.DTOS;
using backend.ResponseMessages;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/auth")]
  public class AuthorizationController : ControllerBase
  {

    private readonly string client_id = Environment.GetEnvironmentVariable("ClientId");
    private readonly string client_secret = Environment.GetEnvironmentVariable("ClientSecret");
    private readonly UserService _userService;
    private readonly IMapper _mapper;

    public AuthorizationController(UserService userService, IMapper mapper)
    {
      _userService = userService;
      _mapper = mapper;
    }

    [HttpPost("token")]
    public async Task<System.IO.Stream> HandleToken(string code)
    {

      {

        using (HttpClient client = new HttpClient())
        {
          Uri uri = new Uri($"https://github.com/login/oauth/access_token?client_id={client_id}&client_secret={client_secret}&code={code}&redirect_uri=http://localhost:5500/frontend/test.html");

          var response = await client.PostAsync(uri, null);
          var contents = await response.Content.ReadAsStreamAsync();
          return contents;
        }
      }

    }

    [HttpPost("login")]
    public ActionResult<string> Login(UserSendDto userSendDto)
    {
      var user = _userService.GetUserByEmail(userSendDto.Email);
      if (user == null)
      {
        return NotFound(ResponseMessage.UserResponseMessage.NotFound);
      }

      if (user.Password != userSendDto.Password)
      {
        return BadRequest(ResponseMessage.UserResponseMessage.BadLogin);
      }

      var token = GenerateToken(user.Id);

      // var identity = new ClaimsIdentity(JwtBearerDefaults.AuthenticationScheme);
      // identity.AddClaim(new Claim(ClaimTypes.Email, user.Email));

      // await HttpContext.SignInAsync(JwtBearerDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

      // var userReadDto = _mapper.Map<UserReadDto>(user);


      return Ok(token);
    }
    [HttpPost("logout")]
    // public async Task<IActionResult> Logout()
    // {
    //   await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    //   return Ok();
    // }


    private string GenerateToken(string UserId)
    {
      // var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
      var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(client_secret));

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

    // private string GetClaim(string token, string ClaimType)
    // {
    //   var tokenHandler = new JwtSecurityTokenHandler();
    //   var securityToken = tokenHandler.ReadJwtToken(token) as JwtSecurityToken;

    //   var stringClaimValue = securityToken.Claims.First(claim => claim.Type == ClaimType).Value;
    //   return stringClaimValue;
    // }

  }
}