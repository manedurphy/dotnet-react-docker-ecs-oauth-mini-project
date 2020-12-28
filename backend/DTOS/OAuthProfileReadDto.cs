using System.ComponentModel.DataAnnotations;

namespace backend.DTOS
{
  public class OAuthProfileReadDto
  {
    public string Id { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public string Platform { get; set; }
  }
}