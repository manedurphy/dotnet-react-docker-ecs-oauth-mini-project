using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
  public class RefreshTokenRequest
  {
    [Required]
    public string RefreshToken { get; set; }
    [Required]
    public string Email { get; set; }
  }
}