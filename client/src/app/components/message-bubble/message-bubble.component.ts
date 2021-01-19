import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss']
})
export class MessageBubbleComponent implements OnInit {

  @Input() public isCurrentUser = false;
  @Input() public message: string = null;
  @Input() public username: string = null;

  constructor() { }

  ngOnInit(): void {
  }
}
