import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth.service';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  public sidenav = true;
  public users: Array<User> = [];

  public messages: Array<Message> = [];
  public message: string;
  public username: string = null;

  constructor(
    private authService: AuthService,
    private signalRService: SignalRService
  ) { }

  ngOnInit(): void {
    this.username = this.authService.user.username;
    this.signalRService.startConnection("chathub");

    this.signalRService.registerEvent("ReceiveMessage", (sender, message) => {
      this.messages.push({ message, sender });
    });

    this.signalRService.registerEvent("UsersList", (users: Array<User>) => {
      this.users = users.filter(x => x.username !== this.username);
      console.log("UsersList", this.users);
    });

    this.signalRService.registerEvent("UserConnected", (user) => {
      this.users.push(user);
    });

    this.signalRService.registerEvent("UserDisconnected", (userId) => {
      this.users = this.users.filter(x => x.id !== userId);
    });
  }

  public sendMessage(): void {
    this.signalRService.sendEvent("SendMessage", this.username, this.message);
    this.message = "";
  }

  public onMessageKeyUp($event: KeyboardEvent): void {
    if ($event.key === "Enter") {
      this.sendMessage();
    }
  }
}

interface Message {
  message: string;
  sender: string;
}
