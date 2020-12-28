using System.ComponentModel.DataAnnotations;

namespace backend.DTOS
{
  public class UserRegisterDto : UserSendDto
  {
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]
    public string Password2 { get; set; }
  }
}