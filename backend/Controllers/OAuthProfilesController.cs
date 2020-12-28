using System;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using backend.DTOS;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class OAuthProfilesController : ControllerBase
  {
    private readonly string client_id = Environment.GetEnvironmentVariable("ClientId");
    private readonly string client_secret = Environment.GetEnvironmentVariable("ClientSecret");
    private readonly IOAuthService _oAuthService;
    private readonly IMapper _mapper;
    private readonly ITokenService _tokenService;
    public OAuthProfilesController(IOAuthService oAuthService, IMapper mapper, ITokenService tokenService)
    {
      _oAuthService = oAuthService;
      _mapper = mapper;
      _tokenService = tokenService;
    }

    [HttpGet("{id}", Name = "GetProfile")]
    public OAuthProfile GetProfile(string id)
    {
      return _oAuthService.GetProfileById(id);
    }

    [HttpPost("get-access-token")]
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

    [HttpPost("authorize")]
    public ActionResult Authorize(OAuthProfileSendDto oAuthProfileSendDto)
    {
      var profile = _oAuthService.GetProfileByEmail(oAuthProfileSendDto.Email);

      if (profile == null)
      {
        var newProfile = _mapper.Map<OAuthProfile>(oAuthProfileSendDto);
        newProfile.RefreshToken = _tokenService.GenerateRefreshToken();
        profile = _oAuthService.CreateProfile(newProfile);
      }

      var token = _tokenService.GenerateToken(profile.Id);
      return Ok(new { token, profile.RefreshToken });
    }
  }
}