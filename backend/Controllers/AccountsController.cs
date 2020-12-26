using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AccountsController : ControllerBase
  {
    public List<User> Users = new List<User> {
      new User() {Username = "test", Password = "password"},
      new User() {Username = "test2", Password = "password2"}
    };

    [HttpPost("login")]
    public async Task<IActionResult> Login(User user)
    {
      const string badUserNameOrPasswordMessage = "Username or password is incorrect.";
      if (user == null)
      {
        return BadRequest(badUserNameOrPasswordMessage);
      }

      var lookupUser = Users.FirstOrDefault(u => u.Username == user.Username);

      if (lookupUser?.Password != user.Password)
      {
        return BadRequest(badUserNameOrPasswordMessage);
      }

      var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
      identity.AddClaim(new Claim(ClaimTypes.Name, lookupUser.Username));

      await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

      return Ok(lookupUser);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
      await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
      return Ok();
    }
  }
}