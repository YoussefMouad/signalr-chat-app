import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { SignupPageComponent } from './pages/auth/signup-page/signup-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';

const routes: Routes = [
  { path: "login", pathMatch: 'full', component: LoginPageComponent },
  { path: "signup", pathMatch: 'full', component: SignupPageComponent },
  { path: "", pathMatch: 'full', component: ChatPageComponent, canActivate: [AuthGuard] },
  { path: "**", pathMatch: 'full', redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
