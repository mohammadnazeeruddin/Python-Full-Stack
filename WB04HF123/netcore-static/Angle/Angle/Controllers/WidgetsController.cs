using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Angle.Controllers
{
    public class WidgetsController : Controller
    {
        // GET: Widgets
        public IActionResult Index()
        {
            return View();
        }
    }
}