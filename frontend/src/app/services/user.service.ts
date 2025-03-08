import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { HttpUtils } from '../utils/http.utils';
import { Role } from '../models/role.model';
import { SubmittedUser } from '../models/submitted-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usersUrl: string = 'users';
  private readonly findUsersUrl: string = 'find-all';
  private readonly deleteUserUrl: string = 'delete-user';
  private readonly registerUserUrl: string = 'register-user';
  private readonly getFinalUserUrl: string = 'get-final-user';
  private readonly submitEstimationUserUrl: string = 'submit-estimation';
  private readonly emptyEstimationUserUrl: string = 'empty-submit-estimation';
  private readonly port: number = 8080;
  private finalUser: User;

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.usersUrl}/${this.findUsersUrl}`)
      .pipe(catchError(error => throwError(() => error)));
  }

  public getFinalUser(): Observable<User> {
    return !!this.finalUser
      ? of(this.finalUser)
      : this.http
          .get<User>(`http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.usersUrl}/${this.getFinalUserUrl}`)
          .pipe(tap(user => (this.finalUser = user)));
  }

  public registerUser(callsign: string, role: Role, offline: boolean): Observable<User> {
    const joinedUser: User = { callsign, role, offline };
    return this.http
      .post<User>(`http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.usersUrl}/${this.registerUserUrl}`, joinedUser)
      .pipe(catchError(error => throwError(() => error)));
  }

  public deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.usersUrl}/${this.deleteUserUrl}`,
      {
        params: { id }
      }
    );
  }

  public getSessionStorageUser(): User {
    return JSON.parse(sessionStorage.getItem(HttpUtils.USER_STORAGE_KEY));
  }

  public isCurrentUserFeatureLead() {
    return this.getSessionStorageUser()?.role === Role.FEATURE_LEAD.toString();
  }

  public submitUser(submittedUser: SubmittedUser) {
    return this.http.post<SubmittedUser>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.usersUrl}/${this.submitEstimationUserUrl}`,
      submittedUser
    );
  }

  public emptySubmittedUsers() {
    return this.http.delete<void>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.usersUrl}/${this.emptyEstimationUserUrl}`
    );
  }
}
