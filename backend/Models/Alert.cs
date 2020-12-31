namespace backend.Models
{
  public class Alert
  {
    public string Message { get; set; }
    public Alert(string message)
    {
      Message = message;
    }
  }
}