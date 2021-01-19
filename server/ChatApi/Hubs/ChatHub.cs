using ChatApi.Services;
using ChatApi.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatApi.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILogger _logger;
        private readonly static List<User> _connections = new List<User>();
        private readonly static Dictionary<string, List<string>> _connectionsMap = new Dictionary<string, List<string>>();
        private readonly AuthService _authService;

        public ChatHub(ILogger<ChatHub> logger, AuthService authService)
        {
            _logger = logger;
            _authService = authService;
        }

        public override Task OnConnectedAsync()
        {
            var id = Context.UserIdentifier;
            _logger.LogInformation("Connected user : {0}", id);
            var user = _authService.GetUser(new Guid(id));
            if (_connectionsMap.ContainsKey(id))
            {
                _connectionsMap[id].Add(Context.ConnectionId);
            }
            else
            {
                _connections.Add(user);
                _connectionsMap.Add(id, new List<string>() { Context.ConnectionId });
            }

            Clients.Caller.SendAsync("UsersList", _connections);
            Clients.Others.SendAsync("UserConnected", user);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var id = Context.UserIdentifier;
            if (_connectionsMap.ContainsKey(id))
            {
                if (_connectionsMap[id].Count > 1)
                {
                    _connectionsMap[id].Remove(Context.ConnectionId);
                }
                else
                {
                    _connectionsMap.Remove(id);
                    _connections.RemoveAll(x => x.Id.ToString() == id);
                    Clients.All.SendAsync("UserDisconnected", id);
                }
            }
            return base.OnDisconnectedAsync(exception);
        }

        public Task SendMessage(string message, string user)
        {
            _logger.LogInformation("SendMessage : {0} - {1}", message, user);
            return Clients.All.SendAsync("ReceiveMessage", message, user);
        }

        public async Task SendTo(string message, string receiverId)
        {
            if (!string.IsNullOrEmpty(message.Trim()) && _connectionsMap.TryGetValue(receiverId, out List<string> connections))
            {
                // Send the message
                var sender = Context.UserIdentifier;
                await Clients.Clients(connections).SendAsync("ReceivePrivateMessage", message, sender);
                await Clients.Caller.SendAsync("ReceivePrivateMessage", message, sender, receiverId);
            }
        }
    }
}
