using System;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace backend.Services
{
  public class UserService : IAuthorizationService<User>
  {

    private readonly IMongoCollection<User> _users;

    public UserService()
    {
      var client = new MongoClient(Environment.GetEnvironmentVariable("MONGO_CONNECTION"));
      var database = client.GetDatabase(Environment.GetEnvironmentVariable("MONGO_DATABASE"));

      _users = database.GetCollection<User>("Users");
    }

    [ActionName("GetUserById")]
    public User GetById(string id)
    {
      return _users.Find<User>(user => user.Id == id).FirstOrDefault();
    }

    public User GetByEmail(string email)
    {
      return _users.Find<User>(user => user.Email == email).FirstOrDefault();
    }

    public User Create(User user)
    {
      _users.InsertOne(user);
      return user;
    }

    public void Update(User user)
    {
      _users.ReplaceOne(u => u.Id == user.Id, user);
    }

    public User GetByRefreshToken(string refreshToken)
    {
      return _users.Find<User>(user => user.RefreshToken == refreshToken).FirstOrDefault();
    }
  }
}