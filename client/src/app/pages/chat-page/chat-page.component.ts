import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  public sidenav = true;
  public users: string[] = ["User 1", "User 2", "User 3"];

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    this.signalRService.startConnection("chathub");
  }

}
