using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOS;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace backend.Services
{
  public interface IUserService
  {
    List<User> GetUsers();
    User GetUserById(string id);
    User GetUserByEmail(string email);
    User CreateUser(User user);
  }
  public class UserService : IUserService
  {

    private readonly IMongoCollection<User> _users;

    public UserService()
    {
      var client = new MongoClient(Environment.GetEnvironmentVariable("MONGO_CONNECTION"));
      var database = client.GetDatabase(Environment.GetEnvironmentVariable("MONGO_DATABASE"));

      _users = database.GetCollection<User>("Users");
    }

    public List<User> GetUsers()
    {
      return _users.Find(user => true).ToList();
    }

    [ActionName(nameof(GetUserById))]
    public User GetUserById(string id)
    {
      return _users.Find<User>(user => user.Id == id).FirstOrDefault();
    }

    public User GetUserByEmail(string email)
    {
      return _users.Find<User>(user => user.Email == email).FirstOrDefault();
    }

    public User CreateUser(User user)
    {
      _users.InsertOne(user);
      return user;
    }
  }
}