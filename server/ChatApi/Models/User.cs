using System;
using System.Text.Json.Serialization;

namespace ChatApi.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Fullname { get; set; }
        public string Avatar { get; set; }

        // Internal get to prevent the password from being serialized back to the client
        public string Password { internal get; set; }
    }
}
