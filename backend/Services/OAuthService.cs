using backend.Models;
using MongoDB.Driver;
using System;

namespace backend.Services
{
  public class OAuthService : IAuthorizationService<OAuthProfile>
  {
    private readonly IMongoCollection<OAuthProfile> _oAuthProfiles;
    public OAuthService()
    {
      var client = new MongoClient(Environment.GetEnvironmentVariable("MONGO_CONNECTION"));
      var database = client.GetDatabase(Environment.GetEnvironmentVariable("MONGO_DATABASE"));

      _oAuthProfiles = database.GetCollection<OAuthProfile>("OAuthProfiles");
    }
    public OAuthProfile GetById(string id)
    {
      return _oAuthProfiles.Find(p => p.Id == id).FirstOrDefault();
    }

    public OAuthProfile GetByEmail(string email)
    {
      return _oAuthProfiles.Find<OAuthProfile>(p => p.Email == email).FirstOrDefault();
    }

    public OAuthProfile Create(OAuthProfile oAuthProfile)
    {
      _oAuthProfiles.InsertOne(oAuthProfile);
      return oAuthProfile;
    }

    public void Update(OAuthProfile oAuthProfile)
    {
      _oAuthProfiles.ReplaceOne(p => p.Id == oAuthProfile.Id, oAuthProfile);
    }
  }
}