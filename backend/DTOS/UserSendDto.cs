using System.ComponentModel.DataAnnotations;

namespace backend.DTOS
{
  public class UserSendDto
  {
    [Required]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
  }
}