using AutoMapper;
using backend.DTOS;
using backend.Models;

namespace backend.Profiles
{
  public class OAuthProfileProfile : Profile
  {
    public OAuthProfileProfile()
    {
      CreateMap<OAuthProfileSendDto, OAuthProfile>();
      CreateMap<OAuthProfile, OAuthProfileReadDto>();
    }
  }
}