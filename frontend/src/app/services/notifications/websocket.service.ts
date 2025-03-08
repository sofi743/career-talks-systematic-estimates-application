import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { WebSocketSubjectConfig } from 'rxjs/webSocket';

/**
 * @deprecated This service is obsolete and should not be used. Use WebSocketStompService instead.
 */
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private sockets: Map<string, WebSocketSubject<any>> = new Map();

  constructor() {}

  /**
   * Create or return a new WebSocketSubject or the existing connection
   * @param config
   */
  public connect(config: WebSocketSubjectConfig<any>): WebSocketSubject<any> | null {
    let socket: WebSocketSubject<any> | null = null;

    try {
      if (this.sockets.has(config.url)) {
        // return existing connection if it's already created
        return this.sockets.get(config.url) || null;
      }
      socket = webSocket(config); // Create new websocket
      this.sockets.set(config.url, socket);
      console.log(socket, config.url);
    } catch (err) {
      console.log('err');
    }

    return socket;
  }

  //to be called in ngOnDestroy
  public disconnectAll(): void {
    this.sockets.forEach((socket: WebSocketSubject<any>, url: string) => {
      try {
        if (socket) {
          socket.complete();
        }
      } catch (err) {
        console.log(err);
      }
    });
    this.sockets.clear();
  }
}
