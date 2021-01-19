import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    this.authService.authenticate(this.username, this.password)
      .subscribe(response => {
        console.log(response);
        if (response.error) {
          this.openSnackBar(response.error, "Close");
        } else {

          console.log("here!!!");
          this.router.navigate(["/"]);
        }
      });
  }

  public onKeyUp($event: KeyboardEvent): void {
    if ($event.key === "Enter") {
      this.onSubmit();
    }
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
