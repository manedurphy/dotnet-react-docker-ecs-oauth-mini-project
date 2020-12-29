namespace backend.ResponseMessages
{
  public static class ResponseMessage
  {
    public static class UserResponseMessage
    {
      public const string NotFound = "User with that email not found.";
      public const string UserExists = "User with that email already exists. Please try another.";
      public const string BadLogin = "Username or password is incorrect.";
      public const string BadPassword = "Passwords do not match";
    }

    public static class OAuthResonseMessage
    {
      public const string ProfileExists = "A Profile with that email has already been authorized";
    }

    public static class WeatherForecastResponse
    {
      public const string Unauthorized = "You are not authorized to receive this data. Please register or login with a third party provider";
    }
  }
}