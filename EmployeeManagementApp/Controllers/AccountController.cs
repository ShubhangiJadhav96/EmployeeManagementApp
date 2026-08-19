using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementApp.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Login()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }
    }
}