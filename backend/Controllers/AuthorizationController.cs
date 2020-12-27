using System;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using backend.Services;
using backend.DTOS;
using backend.ResponseMessages;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using MongoDB.Driver;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthorizationController : ControllerBase
  {

    private readonly string client_id = Environment.GetEnvironmentVariable("ClientId");
    private readonly string client_secret = Environment.GetEnvironmentVariable("ClientSecret");
    private readonly string myIssuer = "http://localhost:8080";
    private readonly string myAudience = "http://localhost:5500";
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AuthorizationController(IUserService userService, ITokenService tokenService, IMapper mapper)
    {
      _userService = userService;
      _tokenService = tokenService;
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

      var token = _tokenService.GenerateToken(user.Id);

      return Ok(new AuthResponse(user.FirstName, user.Email, token, user.RefreshToken));
    }

    [HttpPost("refresh")]
    public ActionResult<AuthResponse> GetNewToken(RefreshTokenRequest refreshTokenRequest)
    {
      var user = _userService.GetUserByEmail(refreshTokenRequest.Email);
      if (user == null)
      {
        return BadRequest("Invalid request");
      }

      if (user.RefreshToken != refreshTokenRequest.RefreshToken)
      {
        return BadRequest("Invalid request");
      }

      var newToken = _tokenService.GenerateToken(user.Id);
      var newRefreshToken = _tokenService.GenerateRefreshToken();

      user.RefreshToken = newRefreshToken;
      _userService.UpdateRefreshToken(user);

      return Ok(new AuthResponse(user.FirstName, user.Email, newToken, newRefreshToken));
    }
    // [HttpPost("logout")]
    // public async Task<IActionResult> Logout()
    // {
    // await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    //   return Ok();
    // }


    // private string GenerateToken(string UserId)
    // {
    //   var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
    //   var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));

    //   var tokenHandler = new JwtSecurityTokenHandler();
    //   var tokenDescriptor = new SecurityTokenDescriptor
    //   {
    //     Subject = new ClaimsIdentity(new Claim[]
    //     {
    //       new Claim(ClaimTypes.NameIdentifier, UserId.ToString())
    //     }),
    //     Expires = DateTime.UtcNow.AddDays(7),
    //     SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
    //   };

    //   var token = tokenHandler.CreateToken(tokenDescriptor);
    //   return tokenHandler.WriteToken(token);
    // }

    // private bool ValidateToken(string token)
    // {
    //   var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
    //   var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));


    //   var tokenHandler = new JwtSecurityTokenHandler();
    //   try
    //   {
    //     tokenHandler.ValidateToken(token, new TokenValidationParameters
    //     {
    //       ValidateIssuerSigningKey = true,
    //       ValidateIssuer = true,
    //       ValidateAudience = true,
    //       ValidIssuer = myIssuer,
    //       ValidAudience = myAudience,
    //       IssuerSigningKey = mySecurityKey
    //     }, out SecurityToken validatedToken);
    //   }
    //   catch
    //   {
    //     return false;
    //   }
    //   return true;
    // }

    // private string GetClaim(string token, string ClaimType)
    // {
    //   var tokenHandler = new JwtSecurityTokenHandler();
    //   var securityToken = tokenHandler.ReadJwtToken(token) as JwtSecurityToken;

    //   var stringClaimValue = securityToken.Claims.First(claim => claim.Type == ClaimType).Value;
    //   return stringClaimValue;
    // }

  }
}