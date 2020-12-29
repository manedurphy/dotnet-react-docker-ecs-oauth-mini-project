using System;
using AutoMapper;
using backend.Services;
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
    private readonly IAuthorizationService<User> _userService;
    private readonly ITokenService _tokenService;
    private readonly IAuthorizationService<OAuthProfile> _oAuthService;
    private readonly IMapper _mapper;

    public AuthorizationController(IAuthorizationService<User> userService, ITokenService tokenService, IAuthorizationService<OAuthProfile> oAuthService, IMapper mapper)
    {
      _userService = userService;
      _tokenService = tokenService;
      _mapper = mapper;
      _oAuthService = oAuthService;
    }



    [HttpPost("refresh")]
    public ActionResult GetNewToken(RefreshTokenRequest refreshTokenRequest)
    {
      var user = _userService.GetByRefreshToken(refreshTokenRequest.RefreshToken);
      if (user != null)
      {
        if (user.RefreshToken != refreshTokenRequest.RefreshToken)
        {
          return Unauthorized();
        }

        var newToken = _tokenService.GenerateToken(user.Id);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        _userService.Update(user);

        return Ok(new AuthResponse(user.FirstName, user.Email, newToken, newRefreshToken));
      }

      var profile = _oAuthService.GetByRefreshToken(refreshTokenRequest.RefreshToken);
      if (profile != null)
      {
        if (profile.RefreshToken != refreshTokenRequest.RefreshToken)
        {
          return Unauthorized();
        }

        var newToken = _tokenService.GenerateToken(profile.Id);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        profile.RefreshToken = newRefreshToken;
        _oAuthService.Update(profile);

        return Ok(new { token = newToken, refreshToken = newRefreshToken });
      }

      return BadRequest();
    }

  }
}