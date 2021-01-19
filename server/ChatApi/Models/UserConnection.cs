using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatApi.Models
{
    public class UserConnection
    {
        public User User { get; set; }
        public List<string> Connections { get; set; }
    }
}
