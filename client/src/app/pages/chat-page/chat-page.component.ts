import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  public sidenav = true;
  public users: string[] = ["User 1", "User 2", "User 3"];

  constructor() { }

  ngOnInit(): void {
  }

}
