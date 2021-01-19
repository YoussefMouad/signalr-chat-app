using ChatApi.Models;
using ChatApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ChatApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService service;

        public AuthController(AuthService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<ActionResult<dynamic>> Post([FromBody] User model)
        {
            var user = service.AuthenticateUser(model.Username, model.Password);

            if (user == null)
                return new { error = "User or password invalid." };

            var token = service.CreateToken(user);
            return await Task.Run(() =>
            {
                return new
                {
                    user = user,
                    token = token
                };
            });
        }

        [HttpPut]
        public async Task<ActionResult<dynamic>> Put([FromBody] User model)
        {
            var user = service.CreateUser(model);

            var token = service.CreateToken(user);
            return await Task.Run(() =>
            {
                return new
                {
                    user = user,
                    token = token
                };
            });
        }

        [HttpGet]
        [Route("anonymous")]
        public string Anonymous() => "You are Anonymous";

        [HttpGet]
        [Route("authenticated")]
        [Authorize]
        public string Authenticated()
        {
            var id = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            return string.Format("Authenticated - {0} / {1}", User.Identity.Name, id);
        }

    }
}
