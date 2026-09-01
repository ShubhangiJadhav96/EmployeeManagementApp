using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementApp.Controllers
{
    public class UsersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
