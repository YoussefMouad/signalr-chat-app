import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  public sidenav = true;
  public users: string[] = ["User 1", "User 2", "User 3"];

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
