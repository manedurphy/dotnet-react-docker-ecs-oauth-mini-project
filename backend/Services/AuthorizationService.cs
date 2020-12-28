using System;
using MongoDB.Driver;

namespace backend.Services
{
  public interface IAuthorizationService<TEntity>
  {
    TEntity GetById(string id);
    TEntity GetByEmail(string id);
    TEntity Create(TEntity entity);
    void Update(string id, TEntity entity);

  }
  public class AuthorzationService<TEntity> : IAuthorizationService<TEntity> where TEntity : class
  {
    protected readonly IMongoCollection<TEntity> _entities;
    public AuthorzationService(string name, string email)
    {
      var client = new MongoClient(Environment.GetEnvironmentVariable("MONGO_CONNECTION"));
      var database = client.GetDatabase(Environment.GetEnvironmentVariable("MONGO_DATABASE"));


      _entities = database.GetCollection<TEntity>(name);
    }

    public TEntity Create(TEntity entity)
    {
      _entities.InsertOne(entity);
      return entity;
    }

    public TEntity GetByEmail(string email)
    {
      return _entities.Find<TEntity>(email).FirstOrDefault();
    }

    public TEntity GetById(string id)
    {
      return _entities.Find<TEntity>(id).FirstOrDefault();
    }

    public void Update(string id, TEntity entity)
    {
      _entities.ReplaceOne(id, entity);
    }


  }
}