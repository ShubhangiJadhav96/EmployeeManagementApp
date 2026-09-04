using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementApp.Controllers
{
    public class DepartmentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
