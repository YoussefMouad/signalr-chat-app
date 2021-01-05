import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public username = "";
  public password = "";

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    this.authService.authenticate(this.username, this.password)
      .subscribe(console.log);
  }

}
