import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public username = "";
  public password = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    this.authService.authenticate(this.username, this.password)
      .subscribe(() => this.router.navigate([""]));
  }
}
