using AutoMapper;
using backend.DTOS;
using backend.Models;

namespace backend.Profiles
{
  public class UsersProfile : Profile
  {
    public UsersProfile()
    {
      CreateMap<UserRegisterDto, User>();
      CreateMap<User, UserReadDto>();
    }
  }
}