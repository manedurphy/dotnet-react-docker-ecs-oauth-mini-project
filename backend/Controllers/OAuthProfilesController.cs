using System;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using backend.DTOS;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace backend.Controllers
{

  [ApiController]
  [Route("api/[controller]")]
  public class OAuthProfilesController : ControllerBase
  {
    private readonly string client_id = Environment.GetEnvironmentVariable("ClientId");
    private readonly string client_secret = Environment.GetEnvironmentVariable("ClientSecret");
    private readonly IAuthorizationService<OAuthProfile> _oAuthService;
    private readonly IMapper _mapper;
    private readonly ITokenService _tokenService;
    private readonly IAuthorizationService<User> _userService;
    public OAuthProfilesController(IAuthorizationService<OAuthProfile> oAuthService, IMapper mapper, ITokenService tokenService, IAuthorizationService<User> userService)
    {
      _oAuthService = oAuthService;
      _mapper = mapper;
      _tokenService = tokenService;
      _userService = userService;
    }

    [HttpGet("{id}", Name = "GetProfile")]
    public OAuthProfile GetProfile(string id)
    {
      return _oAuthService.GetById(id);
    }

    [HttpPost("get-access-token")]
    public async Task<System.IO.Stream> HandleToken(string code)
    {
      using (HttpClient client = new HttpClient())
      {
        Uri uri = new Uri($"https://github.com/login/oauth/access_token?client_id={client_id}&client_secret={client_secret}&code={code}");

        var response = await client.PostAsync(uri, null);
        var contents = await response.Content.ReadAsStreamAsync();
        return contents;
      }
    }


    [HttpPost("authorize")]
    public async Task<ActionResult> Authorize(OAuthProfileSendDto oAuthProfileSendDto)
    {

      User existingUser = _userService.GetByEmail(oAuthProfileSendDto.Email);
      if (existingUser != null)
      {
        return BadRequest(new Alert(ResponseMessages.ResponseMessage.UserResponseMessage.UserExists));
      }

      using (HttpClient client = new HttpClient())
      {

        Uri uri = new Uri("https://api.github.com/user/emails");
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + oAuthProfileSendDto.AccessToken);
        client.DefaultRequestHeaders.UserAgent.TryParseAdd("request");

        HttpResponseMessage response = await client.GetAsync("https://api.github.com/user");

        if (response.IsSuccessStatusCode)
        {
          var content = await response.Content.ReadAsStringAsync();
          var deserialized = JsonConvert.DeserializeObject<GitHubUserInfo>(content);

          OAuthProfile profile = _oAuthService.GetByEmail(oAuthProfileSendDto.Email);

          if (profile == null)
          {
            OAuthProfile newProfile = _mapper.Map<OAuthProfile>(oAuthProfileSendDto);

            newProfile.RefreshToken = _tokenService.GenerateRefreshToken();
            newProfile.UserName = deserialized.login;
            newProfile.Picture = deserialized.avatar_url;

            profile = _oAuthService.Create(newProfile);
          }
          else if (profile.Platform == "GitHub")
          {
            profile.RefreshToken = _tokenService.GenerateRefreshToken();
            _oAuthService.Update(profile);
          }
          else
          {
            return BadRequest(new Alert(ResponseMessages.ResponseMessage.OAuthResonseMessage.ProfileOnDifferentPlatform));
          }

          string token = _tokenService.GenerateToken(profile.Id);
          return Ok(new AuthResponse(deserialized.login, profile.Email, token, profile.RefreshToken));
        }
        else
        {
          return BadRequest();
        }

      }
    }

    [HttpPost("google")]
    public async Task<ActionResult> ValidateGoogleAccount(GoogleIdToken googleIdToken)
    {

      User existingUser = _userService.GetByEmail(googleIdToken.Email);
      if (existingUser != null)
      {
        return BadRequest(new Alert(ResponseMessages.ResponseMessage.UserResponseMessage.UserExists));
      }

      using (HttpClient client = new HttpClient())
      {
        Uri uri = new Uri($"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={googleIdToken.IdToken}");
        HttpResponseMessage response = await client.GetAsync(uri);
        var contents = await response.Content.ReadAsStringAsync();
        var deserialized = JsonConvert.DeserializeObject<GoogleUserInfo>(contents);

        if (response.IsSuccessStatusCode && deserialized.email_verified == "true")
        {
          OAuthProfile profile = _oAuthService.GetByEmail(googleIdToken.Email);
          string refreshToken = _tokenService.GenerateRefreshToken();

          if (profile == null)
          {
            var newProfile = new OAuthProfile($"{deserialized.given_name} {deserialized.family_name}", deserialized.email, "Google", refreshToken, deserialized.picture);

            profile = _oAuthService.Create(newProfile);
          }
          else if (profile.Platform == "Google")
          {
            profile.RefreshToken = refreshToken;
            _oAuthService.Update(profile);
          }
          else
          {
            return BadRequest(new Alert(ResponseMessages.ResponseMessage.OAuthResonseMessage.ProfileOnDifferentPlatform));
          }

          string token = _tokenService.GenerateToken(profile.Id);
          return Ok(new AuthResponse(profile.UserName, profile.Email, token, profile.RefreshToken));
        }
      }
      return BadRequest();
    }
  }
}