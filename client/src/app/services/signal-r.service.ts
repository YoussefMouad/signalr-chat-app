import { Injectable } from '@angular/core';
import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  constructor(private authService: AuthService) { }

  public startConnection(hub: string): void {

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.baseUrl}/${hub}`, { accessTokenFactory: () => this.authService.token })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log(`Error while starting connection hub: ${hub}: ` + err));
  }

  public registerEvent(event: string, callback: (...args: any[]) => void): void {
    this.hubConnection.on(event, callback);
  }

  public sendEvent(event: string, ...args: any[]): void {
    this.hubConnection.invoke(event, ...args);
  }
}
