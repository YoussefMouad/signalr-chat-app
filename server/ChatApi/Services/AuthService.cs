using ChatApi.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChatApi.Services
{
    public class AuthService
    {
        private const double EXPIRE_HOURS = 24D;
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public User AuthenticateUser(string username, string password)
        {
            return new User()
            {
                Id = Guid.NewGuid(),
                Username = "User - " + DateTime.Now.Second,
            };
        }

        public string CreateToken(User user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);
            var tokenHandler = new JwtSecurityTokenHandler();
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                }),
                Expires = DateTime.UtcNow.AddHours(EXPIRE_HOURS),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(descriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
