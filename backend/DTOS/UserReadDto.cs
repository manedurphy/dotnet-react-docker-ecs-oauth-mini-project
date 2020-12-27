using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.DTOS
{
  public class UserReadDto
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
  }
}