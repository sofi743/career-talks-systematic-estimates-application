import { Injectable } from '@angular/core';
import { catchError, filter, Observable, throwError } from 'rxjs';

import { WebSocketStompService } from './websocket-stomp.service';
import { Notification } from '../../models/notifications/notification';
import { HttpUtils } from '../../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class NotificationStompService {
  public readonly ROOT_TOPIC: string = '/topic';

  constructor(private readonly webSocketStompService: WebSocketStompService) {}
  public startSocket() {
    const url = `http://${HttpUtils.HOSTNAME_URL}:8080/ws`;
    console.log('WebSocket URL:', url);
    return this.webSocketStompService
      .connect(url)
      .pipe(
        catchError(error => {
          console.error('Error connecting to WebSocket:', error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  /**
   * Sends the data through the socket
   * @param destination
   * @param data: sent data
   */
  public sendData<T>(destination: string, data: T): void {
    this.webSocketStompService.sendData(destination, data);
  }

  /**
   * Subscribes to a specific topic
   * @param topic
   */
  public subscribeToTopic<T>(topic: string): Observable<Notification<T>> {
    return this.webSocketStompService.subscribeToTopic(topic);
  }

  /**
   * Socket is ready to be used
   */
  public isSocketReady(): Observable<boolean> {
    return this.webSocketStompService.socketConnected.pipe(filter(data => data));
  }
}
