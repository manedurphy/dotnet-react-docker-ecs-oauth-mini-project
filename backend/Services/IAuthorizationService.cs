namespace backend.Services
{
  public interface IAuthorizationService<TEntity>
  {
    TEntity Create(TEntity oAuthProfile);
    TEntity GetById(string id);
    TEntity GetByEmail(string email);
    TEntity GetByRefreshToken(string refreshToken);
    void Update(TEntity oAuthProfile);
  }
}