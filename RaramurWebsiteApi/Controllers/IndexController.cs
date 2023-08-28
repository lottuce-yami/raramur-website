using Microsoft.AspNetCore.Mvc;

namespace RaramurWebsiteApi.Controllers;

public class IndexController : ControllerBase
{
    [HttpGet]
    [Route("/")]
    public IActionResult Index()
    {
        return new ObjectResult("Raramur: Admire & Create");
    }
}