import { Injectable } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, filter, Observable, Subject, Subscription, tap } from 'rxjs';

import { Notification } from '../../models/notifications/notification';

@Injectable({
  providedIn: 'root'
})
export class WebSocketStompService {
  private client: CompatClient;
  private topicSubject$: Subject<string> = new Subject<string>();
  private topicSubscription: Subscription | undefined;
  private messageSubject$: Subject<Notification<any>> = new Subject<Notification<any>>();
  private socketConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.topicSubscription = this.topicSubject$
      .asObservable()
      .pipe(
        filter(data => !!data),
        tap(tp => console.log(tp))
      )
      .subscribe((topic: string) => this.subscribe(topic));
  }

  /**
   * Shows the status of the socket connection
   */
  public get socketConnected(): Observable<boolean> {
    return this.socketConnected$.asObservable();
  }

  /**
   * Connects the current socket on a specific url
   * @param url
   */
  public connect(url: string): Observable<boolean> {
    this.client = Stomp.over(() => new SockJS(url));
    this.client.reconnect_delay = 1000;
    this.client.debug = str => {
      console.log(str); // This will log all STOMP frames and messages
    };
    this.client.connect(
      {},
      (frame: string) => {
        console.log('Connected: ' + frame);
        this.socketConnected$.next(true);
      },
      () => {
        this.socketConnected$.next(false);
      }
    );
    return this.socketConnected$;
  }

  /**
   /**Subscribes to a specific topic
   * @param topic
   */
  public subscribeToTopic<T>(topic: string): Observable<Notification<T>> {
    this.topicSubject$.next(topic);
    return this.messageSubject$.asObservable().pipe(filter(receivedData => receivedData?.topic === topic));
  }

  /**
   * Disconnects the current socket
   */
  public disconnect(): void {
    if (this.client !== null) {
      this.client.disconnect(() => {
        console.log('Disconnected');
        this.topicSubscription?.unsubscribe();
      });
    }
  }

  /**
   * Sends the data on a specific topic
   * @param destination
   * @param data: information to be sent
   */
  public sendData<T>(destination: string, data: T): void {
    this.client.send(destination, {}, JSON.stringify(data));
  }

  private subscribe(topic: string) {
    this.client.subscribe(topic, message => {
      const messageBody = JSON.parse(message?.body);
      if (messageBody && messageBody?.data) {
        this.messageSubject$.next({ topic, data: messageBody?.data, state: messageBody.state });
      }
    });
  }
}
