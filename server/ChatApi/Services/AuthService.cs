using ChatApi.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace ChatApi.Services
{
    public class AuthService
    {
        private const double EXPIRE_HOURS = 24D;
        private readonly IConfiguration _configuration;
        private readonly List<User> _users;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
            _users = new List<User>();
            _users.Add(new User()
            {
                Id = new Guid("f7285734-3961-4106-ad5f-6ef0917d12d1"),
                Email = "imouad.you@gmail.com",
                Fullname = "Mouad Youssef",
                Username = "myoussef",
                Password = "123",
            });
            _users.Add(new User()
            {
                Id = new Guid("bea68946-5d0d-42b4-8b53-e1291469bc24"),
                Email = "imouad.you2@gmail.com",
                Fullname = "Mouad Youssef 2",
                Username = "myoussef2",
                Password = "123",
            });
        }

        public User AuthenticateUser(string username, string password)
        {
            return _users.FirstOrDefault(x => (x.Username == username || x.Email == username) && x.Password == password);
        }

        public User CreateUser(User user)
        {
            var existedUser = _users.FirstOrDefault(x => x.Username == user.Username || x.Email == user.Email);
            if (existedUser != null)
            {
                return existedUser;
            }
            user.Id = Guid.NewGuid();
            _users.Add(user);
            return user;
        }

        public User GetUser(Guid id)
        {
            return _users.FirstOrDefault(x => x.Id == id);
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
