import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, filter, finalize, map, Observable, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { JoinService } from '../../../services/join.service';
import { Role } from '../../../models/role.model';
import { User } from '../../../models/user.model';
import { NavigationService } from '../../../services/navigation.service';
import { NavigationModel } from '../../../models/navigation/navigation.model';
import { NavigationActionsEnum } from '../../../models/navigation/navigation-actions.enum';
import { SubmittedUser } from '../../../models/submitted-user.model';
import { LocalizationService } from '../../../services/localization.service';
import { DeleteDialogComponent } from '../../../create-ifd/src/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {
  private currentRole: Role;
  private currentUsername: string = '';
  private id: number;
  private mvpId: number;
  private taskId: number;
  private destroy$ = new Subject<void>();
  private currentJoinedUsers$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  public message: string;
  private dialogTitle: string;
  private dialogMessage: string;
  protected waitEstimationMessage: string;
  protected waitMessage: string;
  private submittedUsers$: BehaviorSubject<SubmittedUser[]> = new BehaviorSubject([]);
  public isFirstPage$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private _isLoadingSkip$ = new BehaviorSubject<boolean>(false);

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private joinService: JoinService,
    private navigationService: NavigationService,
    private localizationService: LocalizationService,
    private dialog: MatDialog
  ) {
    this.localizationService
      .getLocalizationValues$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dialogTitle = data?.SKIP_DIALOG_TITLE;
        this.dialogMessage = data?.SKIP_DIALOG_MESSAGE;
        this.waitEstimationMessage = data?.WAIT_ESTIMATIONS_MESSAGE;
        this.waitMessage = data?.WAIT_MESSAGE;
      });

    this.joinService
      .getUserList$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => this.setUsers$(users));
  }

  public ngOnInit(): void {
    this.joinService
      .getSubmittedUserList$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => this.setSubmittedUsers$(users));

    this.joinService
      .getRole()
      .pipe(
        take(1),
        filter((role: Role) => !!role),
        switchMap(role => {
          this.currentRole = role;
          return this.joinService.getCallsign();
        }),
        switchMap((callsign: string) => {
          this.currentUsername = callsign;
          return this.route.queryParams;
        }),
        map(params => {
          this.id = params['id'];
          this.mvpId = params['mvpId'];
          this.taskId = params['taskId'];
          return of(this.id);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        _ => {
          if (this.taskId && this.mvpId) {
            this.isFirstPage$.next(false);
          }
          if (this.currentRole === Role.FEATURE_LEAD && !this.mvpId && !this.taskId) {
            const id = this.id;
            const navigation: NavigationModel = {
              navigationActions: NavigationActionsEnum.CREATE_IFD
            };
            this.navigationService.navigate(navigation);
          }
        },
        () => {
          if (this.taskId && this.mvpId) {
            this.isFirstPage$.next(false);
          }
        }
      );
  }

  public isCurrentUserFeatureLead(): boolean {
    return this.userService.isCurrentUserFeatureLead();
  }

  public skipEstimations(): void {
    this.isLoadingSkip = true;
    let result: boolean;
    this.dialog
      .open(DeleteDialogComponent, { data: { title: this.dialogTitle, message: this.dialogMessage } })
      .afterClosed()
      .pipe(
        finalize(() => {
          this.isLoadingSkip = false;
        }),
        switchMap(res => {
          result = res;
          if (res) {
            return this.userService.emptySubmittedUsers();
          } else {
            return of();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (result) {
          const navigationModel: NavigationModel = {
            navigationActions: NavigationActionsEnum.WAIT_ESTIMATION,
            taskId: this.taskId,
            mvpId: this.mvpId
          };
          this.navigationService.prepareToNavigate(navigationModel);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setUsers$(users: User[]): void {
    this.currentJoinedUsers$.next(users);
  }

  public getUsers$(): Observable<User[]> {
    return this.currentJoinedUsers$.asObservable();
  }

  public get isLoadingSkip$(): Observable<boolean> {
    return this._isLoadingSkip$.asObservable();
  }

  public set isLoadingSkip(value: boolean) {
    this._isLoadingSkip$.next(value);
  }

  public getOnlineUsers$(): Observable<User[]> {
    return this.currentJoinedUsers$.asObservable().pipe(map(users => users.filter(user => !user.offline)));
  }

  private setSubmittedUsers$(users: SubmittedUser[]): void {
    if (
      users?.length > 0 &&
      users?.length == this.currentJoinedUsers$.getValue().filter(user => !user.offline)?.length &&
      this.isCurrentUserFeatureLead()
    ) {
      this.allSubmitted();
    }
    this.submittedUsers$.next(users);
  }

  private allSubmitted() {
    this.userService
      .emptySubmittedUsers()
      .pipe(
        switchMap(() => this.route.queryParams),
        takeUntil(this.destroy$)
      )
      .subscribe(params => {
        const navigationModel: NavigationModel = {
          navigationActions: NavigationActionsEnum.WAIT_ESTIMATION,
          taskId: params['taskId'],
          mvpId: params['mvpId']
        };
        this.navigationService.prepareToNavigate(navigationModel);
      });
  }

  public getSubmittedUsers$(): Observable<SubmittedUser[]> {
    return this.submittedUsers$.asObservable();
  }

  public isInitial(): Observable<boolean> {
    return this.isFirstPage$.asObservable();
  }
}
