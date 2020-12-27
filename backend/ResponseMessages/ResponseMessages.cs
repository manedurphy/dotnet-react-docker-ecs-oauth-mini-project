namespace backend.ResponseMessages
{
  public static class ResponseMessage
  {
    public static class UserResponseMessage
    {
      public const string NotFound = "User with that email not found.";
      public const string UserExists = "User with that email already exists. PLease try another.";
      public const string BadLogin = "Username or password is incorrect.";
      public const string BadPassword = "Passwords do not match";
    }
  }
}