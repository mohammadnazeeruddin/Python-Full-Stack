using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Angle.Controllers
{
    public class TablesController : Controller
    {
        public IActionResult TableBootGrid()
        {
            return View();
        }
        public IActionResult TableDatatable()
        {
            return View();
        }
        public IActionResult TableExtended()
        {
            return View();
        }
        public IActionResult TableStandard()
        {
            return View();
        }

    }
}