namespace backend.Services
{
  public interface IAuthorizationService<TEntity>
  {
    TEntity Create(TEntity entity);
    TEntity GetById(string id);
    TEntity GetByEmail(string email);
    TEntity GetByRefreshToken(string refreshToken);
    void Update(TEntity entity);
    void Delete(TEntity entity);
  }
}