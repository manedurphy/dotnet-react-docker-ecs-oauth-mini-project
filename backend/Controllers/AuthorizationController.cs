using System;
using AutoMapper;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

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
      User user = _userService.GetByRefreshToken(refreshTokenRequest.RefreshToken);
      if (user != null)
      {
        if (user.RefreshToken != refreshTokenRequest.RefreshToken)
        {
          return Unauthorized();
        }

        string newToken = _tokenService.GenerateToken(user.Id);
        string newRefreshToken = _tokenService.GenerateRefreshToken();

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

        string newToken = _tokenService.GenerateToken(profile.Id);
        string newRefreshToken = _tokenService.GenerateRefreshToken();

        profile.RefreshToken = newRefreshToken;
        _oAuthService.Update(profile);

        return Ok(new { token = newToken, refreshToken = newRefreshToken });
      }

      return BadRequest();
    }

    [HttpGet("info")]
    [Authorize]
    public ActionResult GetUserInfo()
    {
      string header = Request.Headers["Authorization"];
      string[] splitHeader = header.Split(' ');
      string token = splitHeader[1];

      JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
      JwtSecurityToken readToken = handler.ReadToken(token) as JwtSecurityToken;
      string Id = readToken.Claims.First(claim => claim.Type == "nameid").Value;

      User user = _userService.GetById(Id);
      if (user != null)
      {
        return Ok(new LoggedInResponse(user.FirstName, user.Email));
      }

      OAuthProfile profile = _oAuthService.GetById(Id);
      if (profile != null)
      {
        return Ok(new LoggedInResponse(profile.UserName, profile.Email));
      }

      return BadRequest();
    }


    [HttpDelete("delete/{refreshToken}")]
    public ActionResult DeleteAccount(string refreshToken)
    {
      User user = _userService.GetByRefreshToken(refreshToken);
      if (user != null)
      {
        _userService.Delete(user);
        return Ok(new Alert(ResponseMessages.ResponseMessage.AuthorizationResponse.DeletedUserAccount));
      }

      OAuthProfile profile = _oAuthService.GetByRefreshToken(refreshToken);
      if (profile != null)
      {
        _oAuthService.Delete(profile);
        return Ok(ResponseMessages.ResponseMessage.AuthorizationResponse.DeletedProfileAccount);
      }

      return NotFound(ResponseMessages.ResponseMessage.AuthorizationResponse.NotFound);
    }
  }
}