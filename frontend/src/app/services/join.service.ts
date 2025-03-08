import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, switchMap, take } from 'rxjs';
import { isEqual } from 'lodash';
import { NotificationStompService } from './notifications/notification-stomp.service';
import { NotificationTopicsUtils } from '../utils/notification-topics.utils';
import { Notification } from '../models/notifications/notification';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { HttpUtils } from '../utils/http.utils';
import { SubmittedUser } from '../models/submitted-user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
//todo rename this to user.service
export class JoinService {
  private callsignSubject = new ReplaySubject<string>(1);
  private roleSubject = new ReplaySubject<Role>(1);
  private userList$ = new BehaviorSubject<User[]>([]);
  private submittedUserList$ = new BehaviorSubject<SubmittedUser[]>([]);

  constructor(
    private notificationStompService: NotificationStompService,
    private userService: UserService
  ) {}

  public start(): void {
    this.subscribeToUserList();
    this.subscribeToSubmittedUserList();
  }

  public registerUser(callsign: string, role: Role): Observable<void> {
    return this.userService.registerUser(callsign, role, false).pipe(
      switchMap(user => {
        this.setCallsign(callsign);
        this.setRole(role);
        this.setUserSession(user);
        return of(null);
      })
    );
  }

  public setUserSession(user: User) {
    const userString = JSON.stringify(user);
    sessionStorage.setItem(HttpUtils.USER_STORAGE_KEY, userString);
  }

  public setCallsign(callsign: string): void {
    if (!!callsign) {
      this.callsignSubject.next(callsign);
    }
  }

  public getCallsign(): Observable<string> {
    return this.callsignSubject.asObservable();
  }

  public setRole(role: Role): void {
    if (!!role) {
      this.roleSubject.next(role);
    }
  }

  public getRole(): Observable<Role> {
    return this.roleSubject.asObservable();
  }

  /**
   * Emits every time array is updated (the old value different from the new one)
   * @param data - received user list from backend
   */
  public setUserList$(data: User[]): void {
    if (!!data && !isEqual(data, this.userList$.value)) {
      this.userList$.next(data);
    }
  }

  public getUserList$(): Observable<User[]> {
    return this.userList$.asObservable();
  }

  public setSubmittedUserList$(data: SubmittedUser[]): void {
    if (!!data && !isEqual(data, this.submittedUserList$.value)) {
      this.submittedUserList$.next(data);
    }
  }

  public getSubmittedUserList$(): Observable<SubmittedUser[]> {
    return this.submittedUserList$.asObservable();
  }

  private getUserListFromNotification$(): Observable<User[]> {
    return this.notificationStompService.isSocketReady().pipe(
      take(1),
      switchMap(() =>
        this.notificationStompService.subscribeToTopic<User[]>(NotificationTopicsUtils.USER_LIST_NOTIFICATION_TOPIC)
      ),
      switchMap((message: Notification<User[]>) => {
        console.log(message.data);
        this.setUserList$(message.data);
        return of(message.data);
      })
    );
  }

  private subscribeToUserList(): void {
    this.getUserListFromNotification$().subscribe(
      () => {},
      error => console.log(error)
    );
  }

  private getSubmittedUserListFromNotification$(): Observable<SubmittedUser[]> {
    return this.notificationStompService.isSocketReady().pipe(
      take(1),
      switchMap(() =>
        this.notificationStompService.subscribeToTopic<SubmittedUser[]>(
          NotificationTopicsUtils.SUBMITTED_USER_LIST_NOTIFICATION_TOPIC
        )
      ),
      switchMap((message: Notification<SubmittedUser[]>) => {
        this.setSubmittedUserList$(message.data);
        return of(message.data);
      })
    );
  }

  private subscribeToSubmittedUserList(): void {
    this.getSubmittedUserListFromNotification$().subscribe(
      () => {},
      error => console.log(error)
    );
  }
}
