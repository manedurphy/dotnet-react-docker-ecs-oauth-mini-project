using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
  [ApiController]
  [Route("api")]
  public class HealthCheck : ControllerBase
  {
    [HttpGet]
    public ActionResult GetHealthCheck()
    {
      return Ok();
    }
  }
}