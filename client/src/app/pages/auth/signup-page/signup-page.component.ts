import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth.service';
import { MismatchValidator } from 'src/app/validators/mismatch-validator';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  private readonly passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  public formGroup: FormGroup;

  public get email(): AbstractControl { return this.formGroup.get("email"); }
  public get username(): AbstractControl { return this.formGroup.get("username"); }
  public get fullname(): AbstractControl { return this.formGroup.get("fullname"); }
  public get password(): AbstractControl { return this.formGroup.get("password"); }
  public get repassword(): AbstractControl { return this.formGroup.get("repassword"); }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      fullname: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      password: new FormControl(null, [Validators.required, Validators.pattern(this.passwordRegex)]),
      repassword: new FormControl(null),
    });
    this.repassword.setValidators([
      Validators.required,
      Validators.pattern(this.passwordRegex),
      MismatchValidator.mismatch(this.password),
    ]);
  }

  public onSubmit(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const user: User = {
        email: this.email.value,
        username: this.username.value,
        fullname: this.fullname.value,
        password: this.password.value,
      };

      this.authService.register(user).subscribe(() => this.router.navigate(["/"]));
    }
  }

  public onKeyUp($event: KeyboardEvent): void {
    console.log($event.key);
    if ($event.key === "Enter") {
      this.onSubmit();
    }
  }
}
