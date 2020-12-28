using AutoMapper;
using backend.Services;
using backend.DTOS;
using backend.Models;
using backend.ResponseMessages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using System;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UsersController : ControllerBase
  {
    private readonly IAuthorizationService<User> _userService;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService<OAuthProfile> _oAuthService;
    public UsersController(IAuthorizationService<User> userService, ITokenService tokenService, IMapper mapper, IAuthorizationService<OAuthProfile> oAuthService)
    {
      _userService = userService;
      _tokenService = tokenService;
      _mapper = mapper;
      _oAuthService = oAuthService;
    }


    [HttpGet("{id}", Name = "GetUser")]
    public ActionResult<UserReadDto> GetUser(string id)
    {
      var userReadDto = _mapper.Map<UserRegisterDto>(_userService.GetById(id));
      return Ok(userReadDto);
    }


    [HttpPost("register")]
    public ActionResult<UserReadDto> Register(UserRegisterDto userRegisterDto)
    {
      var existingUser = _userService.GetByEmail(userRegisterDto.Email);
      if (existingUser != null)
      {
        return BadRequest(ResponseMessages.ResponseMessage.UserResponseMessage.UserExists);
      }

      var existingProfile = _oAuthService.GetByEmail(userRegisterDto.Email);
      if (existingProfile != null)
      {
        return BadRequest();
      }

      if (userRegisterDto.Password != userRegisterDto.Password2)
      {
        return BadRequest(ResponseMessage.UserResponseMessage.BadPassword);
      }

      var refreshToken = _tokenService.GenerateRefreshToken();
      var user = _mapper.Map<User>(userRegisterDto);

      user.RefreshToken = refreshToken;
      user.Password = HashPassword(user.Password);
      _userService.Create(user);

      var userReadDto = _mapper.Map<UserReadDto>(user);
      return CreatedAtAction("GetUser", new { id = userReadDto.Id.ToString() }, userReadDto);
    }

    [HttpPost("login")]
    public ActionResult<string> Login(UserLoginDto userLoginDto)
    {
      var user = _userService.GetByEmail(userLoginDto.Email);
      if (user == null)
      {
        return NotFound(ResponseMessage.UserResponseMessage.NotFound);
      }

      if (user.Password != HashPassword(userLoginDto.Password))
      {
        return BadRequest(ResponseMessage.UserResponseMessage.BadLogin);
      }

      var token = _tokenService.GenerateToken(user.Id);

      return Ok(new AuthResponse(user.FirstName, user.Email, token, user.RefreshToken));
    }

    private string HashPassword(string password)
    {
      byte[] salt = new byte[128 / 8];
      using (var rng = RandomNumberGenerator.Create())
      {
        rng.GetBytes(salt);
      }

      string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
        password: password,
        salt: salt,
        prf: KeyDerivationPrf.HMACSHA1,
        iterationCount: 10000,
        numBytesRequested: 256 / 8
      ));

      return hashedPassword;
    }

    // private string DecrpytPassword(string hashPassword)
    // {
    //   byte[] data = Convert.FromBase64String(hashPassword);

    //   byte[] decrypted = ProtectedData
    // }
  }
}