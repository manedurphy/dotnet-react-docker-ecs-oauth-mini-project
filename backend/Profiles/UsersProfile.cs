using AutoMapper;
using backend.DTOS;
using backend.Models;

namespace backend.Profiles
{
  public class UsersProfile : AutoMapper.Profile
  {
    public UsersProfile()
    {
      CreateMap<UserRegisterDto, User>();
      CreateMap<User, UserReadDto>();
    }
  }
}