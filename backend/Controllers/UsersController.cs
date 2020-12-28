using AutoMapper;
using backend.Services;
using backend.DTOS;
using backend.Models;
using backend.ResponseMessages;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UsersController : ControllerBase
  {
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    public UsersController(IUserService userService, ITokenService tokenService, IMapper mapper)
    {
      _userService = userService;
      _tokenService = tokenService;
      _mapper = mapper;
    }


    [HttpGet("{id}", Name = "GetUser")]
    public ActionResult<UserReadDto> GetUser(string id)
    {
      var userReadDto = _mapper.Map<UserRegisterDto>(_userService.GetUserById(id));
      return Ok(userReadDto);
    }


    [HttpPost("register")]
    public ActionResult<UserReadDto> Register(UserRegisterDto userSendDto)
    {
      var existingUser = _userService.GetUserByEmail(userSendDto.Email);
      if (existingUser != null)
      {
        return BadRequest(ResponseMessages.ResponseMessage.UserResponseMessage.UserExists);
      }

      if (userSendDto.Password != userSendDto.Password2)
      {
        return BadRequest(ResponseMessage.UserResponseMessage.BadPassword);
      }

      var refreshToken = _tokenService.GenerateRefreshToken();
      var user = _mapper.Map<User>(userSendDto);

      user.RefreshToken = refreshToken;
      _userService.CreateUser(user);

      var userReadDto = _mapper.Map<UserReadDto>(user);
      return CreatedAtAction("GetUser", new { id = userReadDto.Id.ToString() }, userReadDto);
    }

    [HttpPost("login")]
    public ActionResult<string> Login(UserLoginDto userLoginDto)
    {
      var user = _userService.GetUserByEmail(userLoginDto.Email);
      if (user == null)
      {
        return NotFound(ResponseMessage.UserResponseMessage.NotFound);
      }

      if (user.Password != userLoginDto.Password)
      {
        return BadRequest(ResponseMessage.UserResponseMessage.BadLogin);
      }

      var token = _tokenService.GenerateToken(user.Id);

      return Ok(new AuthResponse(user.FirstName, user.Email, token, user.RefreshToken));
    }
  }
}