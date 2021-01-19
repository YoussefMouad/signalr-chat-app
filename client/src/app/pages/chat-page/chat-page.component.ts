import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  public usersMessages: Map<string, Array<Message>> = new Map();
  public allChatMessages: Array<Message> = [];
  public messages: Array<Message> = [];
  public message: string;
  public user: User = null;
  public isAllChat = true;
  public selectedChat: User = null;

  constructor(
    private authService: AuthService,
    private signalRService: SignalRService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.messages = this.allChatMessages;
    this.signalRService.startConnection("chathub");

    this.signalRService.registerEvent("UsersList", (users: Array<User>) => {
      this.users = users.filter(x => x.username !== this.user.username);
    });

    this.signalRService.registerEvent("UserConnected", (user) => {
      this.users.push(user);
    });

    this.signalRService.registerEvent("UserDisconnected", (userId) => {
      this.users = this.users.filter(x => x.id !== userId);
    });

    this.signalRService.registerEvent("ReceiveMessage", (message, sender) => {
      const username = sender !== this.user.id ? this.getUser(sender).fullname : null;
      this.allChatMessages.push({ message, sender, username });
    });

    this.signalRService.registerEvent("ReceivePrivateMessage", (message, sender, reciever?) => {
      if (sender === this.user.id) {
        this.getRoom(reciever).push({ message, sender });
      } else {
        this.getRoom(sender).push({ message, sender });
        const user = this.users.find(x => x.id === sender);
        if (user) {
          this.openSnackBar(`${user.fullname} said: ${message}`, "View", sender);
        }
      }
    });
  }

  private getUser(userId: string): User {
    return this.users.find(x => x.id === userId);
  }

  public sendMessage(): void {
    if (this.isAllChat) {
      this.signalRService.sendEvent("SendMessage", this.message, this.user.id);
    } else if (this.selectedChat) {
      this.signalRService.sendEvent("SendTo", this.message, this.selectedChat.id);
    }
    this.message = "";
  }

  public onMessageKeyUp($event: KeyboardEvent): void {
    if ($event.key === "Enter") {
      this.sendMessage();
    }
  }

  public onSelectUser(userId: string): void {
    this.users.forEach(x => x.active = false);
    this.isAllChat = false;
    const user = this.getUser(userId);
    user.active = true;
    this.selectedChat = user;
    this.messages = this.getRoom(user.id);
  }

  public onSelectAllChat(): void {
    this.users.forEach(x => x.active = false);
    this.isAllChat = true;
    this.selectedChat = null;
    this.messages = this.getRoom();
  }

  private getRoom(sender?: string): Array<Message> {
    if (sender) {
      const id = sender ?? this.selectedChat.id;
      if (!this.usersMessages.has(id)) {
        this.usersMessages.set(id, []);
      }
      return this.usersMessages.get(id);
    } else if (this.isAllChat) {
      return this.allChatMessages;
    }
  }

  private openSnackBar(message: string, action: string, param: any): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
    }).onAction().subscribe(() => {
      this.onSelectUser(param);
    });
  }
}

interface Message {
  message: string;
  sender: string;
  username?: string;
}
