using System.ComponentModel.DataAnnotations;

namespace backend.DTOS
{
  public class OAuthProfileSendDto
  {
    [Required]
    public string Email { get; set; }
    [Required]
    public string Platform { get; set; }
    [Required]
    public string AccessToken { get; set; }
  }
}