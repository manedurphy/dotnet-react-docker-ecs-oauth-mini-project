using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using backend.Services;
using backend.DTOS;
using backend.Models;
using backend.ResponseMessages;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AccountsController : ControllerBase
  {
    private readonly UserService _userService;
    private readonly IMapper _mapper;
    public AccountsController(UserService userService, IMapper mapper)
    {
      _userService = userService;
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

      var user = _mapper.Map<User>(userSendDto);
      _userService.CreateUser(user);

      var userReadDto = _mapper.Map<UserReadDto>(user);
      return CreatedAtAction("GetUser", new { id = userReadDto.Id.ToString() }, userReadDto);
    }

  }
}