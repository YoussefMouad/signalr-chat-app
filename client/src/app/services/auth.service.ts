import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public token: string = null;
  public userSubject$: BehaviorSubject<User> = null;

  public get user(): User {
    return this.userSubject$.value;
  }

  public get isAuthenticated(): boolean {
    return this.token !== null;
  }

  constructor(private httpClient: HttpClient) {
    this.userSubject$ = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('authUser')));
    this.token = JSON.parse(localStorage.getItem('token'));
  }

  public authenticate(username: string, password: string): Observable<AuthResponse> {
    return this.httpClient.post(`${environment.apiUrl}/auth`, { username, password })
      .pipe(tap(this.setUser));
  }

  public register(user: User): Observable<AuthResponse> {
    return this.httpClient.put(`${environment.apiUrl}/auth`, user)
      .pipe(tap(this.setUser));
  }

  private setUser = (response: AuthResponse) => {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    if (!response.error) {
      localStorage.setItem('authUser', JSON.stringify(response.user));
      localStorage.setItem('token', JSON.stringify(response.token));
      this.userSubject$.next(response.user);
    }
  }
}

interface AuthResponse {
  user: User;
  token: string;
  error: string;
}
