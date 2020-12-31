using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
  public class OAuthProfile
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    [Required]
    public string UserName { get; set; }

    [Required]
    public string Email { get; set; }
    [Required]
    public string Platform { get; set; }
    [Required]
    public string RefreshToken { get; set; }
    [Required]
    public string Picture { get; set; }

    public OAuthProfile(string username, string email, string platform, string refreshToken, string picture)
    {
      UserName = username;
      Email = email;
      Platform = platform;
      RefreshToken = refreshToken;
      Picture = picture;
    }

    public OAuthProfile()
    {
    }
  }
}