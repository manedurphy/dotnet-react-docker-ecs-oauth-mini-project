using System;
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

    [HttpPost("authorize")]
    public ActionResult Authorize(OAuthProfileSendDto oAuthProfileSendDto)
    {
      var profile = _oAuthService.GetProfileByEmail(oAuthProfileSendDto.Email);

      if (profile == null)
      {
        var newProfile = _mapper.Map<OAuthProfile>(oAuthProfileSendDto);
        profile = _oAuthService.CreateProfile(newProfile);
      }

      var token = _tokenService.GenerateToken(profile.Id);
      return Ok(new { token });
    }
  }
}