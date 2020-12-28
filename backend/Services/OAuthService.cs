using backend.Models;
using MongoDB.Driver;
using System;

namespace backend.Services
{
  public interface IOAuthService
  {
    OAuthProfile CreateProfile(OAuthProfile oAuthProfile);
    OAuthProfile GetProfileById(string id);
    OAuthProfile GetProfileByEmail(string email);
  }
  public class OAuthService : IOAuthService
  {
    private readonly IMongoCollection<OAuthProfile> _oAuthProfiles;
    public OAuthService()
    {
      var client = new MongoClient(Environment.GetEnvironmentVariable("MONGO_CONNECTION"));
      var database = client.GetDatabase(Environment.GetEnvironmentVariable("MONGO_DATABASE"));

      _oAuthProfiles = database.GetCollection<OAuthProfile>("OAuthProfiles");
    }
    public OAuthProfile GetProfileById(string id)
    {
      return _oAuthProfiles.Find(p => p.Id == id).FirstOrDefault();
    }

    public OAuthProfile GetProfileByEmail(string email)
    {
      return _oAuthProfiles.Find<OAuthProfile>(p => p.Email == email).FirstOrDefault();
    }

    public OAuthProfile CreateProfile(OAuthProfile oAuthProfile)
    {
      _oAuthProfiles.InsertOne(oAuthProfile);
      return oAuthProfile;
    }
  }
}