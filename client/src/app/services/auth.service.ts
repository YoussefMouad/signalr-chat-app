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

  constructor(private httpClient: HttpClient) {
    this.userSubject$ = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('authUser')));
    this.token = JSON.parse(localStorage.getItem('token'));
  }

  public authenticate(username: string, password: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/auth`, { username, password })
      .pipe(map((response: AuthResponse) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('authUser', JSON.stringify(response.user));
        localStorage.setItem('token', JSON.stringify(response.token));
        this.userSubject$.next(response.user);
        return response.user;
      }));
  }
}

interface AuthResponse {
  user: User;
  token: string;
}
