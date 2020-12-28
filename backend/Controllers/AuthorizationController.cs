using System;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using backend.Services;
using backend.DTOS;
using backend.ResponseMessages;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthorizationController : ControllerBase
  {

    private readonly string client_id = Environment.GetEnvironmentVariable("ClientId");
    private readonly string client_secret = Environment.GetEnvironmentVariable("ClientSecret");
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
          Uri uri = new Uri($"https://github.com/login/oauth/access_token?client_id={client_id}&client_secret={client_secret}&code={code}");

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
        return Unauthorized();
      }

      if (user.RefreshToken != refreshTokenRequest.RefreshToken)
      {
        return Unauthorized();
      }

      var newToken = _tokenService.GenerateToken(user.Id);
      var newRefreshToken = _tokenService.GenerateRefreshToken();

      user.RefreshToken = newRefreshToken;
      _userService.UpdateRefreshToken(user);

      return Ok(new AuthResponse(user.FirstName, user.Email, newToken, newRefreshToken));
    }

  }
}