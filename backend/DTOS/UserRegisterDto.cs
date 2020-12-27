namespace backend.DTOS
{
  public class UserRegisterDto : UserSendDto
  {

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Password2 { get; set; }
  }
}