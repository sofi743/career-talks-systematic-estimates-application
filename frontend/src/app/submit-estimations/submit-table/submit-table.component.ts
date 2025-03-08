import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskFieldDescriptor } from '../../models/task-field-descriptor.model';
import { TaskJsonService } from '../../services/task-categories.service';
import { TaskFieldEstimation } from '../../models/task-field-estimation.model';
import { LocalizationService } from '../../services/localization.service';
import { BehaviorSubject, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CurrentInfoModel } from '../../models/current-info.model';
import { ActivatedRoute } from '@angular/router';
import { HttpUtils } from '../../utils/http.utils';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Role } from '../../models/role.model';
import { TaskService } from '../../create-ifd/src/services/task.service';
import { NavigationModel } from '../../models/navigation/navigation.model';
import { NavigationActionsEnum } from '../../models/navigation/navigation-actions.enum';
import { NavigationService } from '../../services/navigation.service';
import { CreateIfdService } from '../../create-ifd/src/services/create-ifd.service';
import { TaskEstimationsService } from '../../services/task-estimations.service';
import { SubmittedUser } from '../../models/submitted-user.model';
import { JoinService } from '../../services/join.service';
import { IfdTotalService } from '../../services/ifd-total.service';
import { CurrentEstimationService } from '../../services/current-estimation.service';

@Component({
  selector: 'app-submit-table',
  templateUrl: './submit-table.component.html',
  styleUrls: ['./submit-table.component.scss']
})
export class SubmitTableComponent implements OnInit, OnDestroy {
  public taskDescriptors: TaskFieldDescriptor[] = [];
  public descriptions: string[] = [];
  public estimations: Map<User, TaskFieldEstimation[]> = new Map<User, TaskFieldEstimation[]>();
  public submitButton: string = '';
  private _destroy$: Subject<void> = new Subject<void>();
  private _isLoadingSubmit$ = new BehaviorSubject<boolean>(false);
  protected _currentInfo: CurrentInfoModel = null;
  public users: User[];
  public currentUser: User;
  private currentIndex: number = 0;
  public isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private currentJoinedUsers$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private submittedUsers$: BehaviorSubject<SubmittedUser[]> = new BehaviorSubject([]);

  constructor(
    private currentEstimationService: CurrentEstimationService,
    private taskJsonService: TaskJsonService,
    private taskEstimationService: TaskEstimationsService,
    private localizationService: LocalizationService,
    private route: ActivatedRoute,
    private ifdTotalService: IfdTotalService,
    protected userService: UserService,
    private navigationService: NavigationService,
    private createIfdService: CreateIfdService,
    private joinService: JoinService
  ) {
    this.joinService
      .getSubmittedUserList$()
      .pipe(takeUntil(this._destroy$))
      .subscribe(users => this.setSubmittedUsers$(users));
    this.joinService
      .getUserList$()
      .pipe(takeUntil(this._destroy$))
      .subscribe(users => this.setUsers$(users));
  }

  public ngOnInit(): void {
    let reestimation: boolean = false;
    this.route.queryParams
      .pipe(
        switchMap(params => {
          const taskId = Number(params['taskId']);
          reestimation = params['reest'] === 'true';
          return this.currentEstimationService.refreshTaskArray(taskId);
        }),
        switchMap(() => this.userService.getUsers()),
        tap(users => {
          this.users = this.filterUsers(users);
          console.log(this.users);
          if (users?.length > 0) {
            this.currentUser = this.users[this.currentIndex];
          }
        })
      )
      .subscribe(() => {
        if (!reestimation) {
          this.currentEstimationService.goToNextTask();
        }
        this._currentInfo = this.currentEstimationService.getCurrentTask();
        if (this._currentInfo !== null) {
          this.loadCurrentTaskType();
        } else {
          if (this.userService.getSessionStorageUser().role === Role.FEATURE_LEAD) {
            this.updateIfdTotalsAndNavigate();
          }
        }
      });
    this.localizationService
      .getLocalizationValues$()
      .pipe(takeUntil(this._destroy$))
      .subscribe(data => {
        this.submitButton = data?.SUBMIT_BUTTON;
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setUsers$(users: User[]): void {
    this.currentJoinedUsers$.next(users);
  }

  private setSubmittedUsers$(users: SubmittedUser[]): void {
    this.submittedUsers$.next(users);
  }

  public getOnlineUsers$(): Observable<User[]> {
    return this.currentJoinedUsers$.asObservable().pipe(map(users => users.filter(user => !user.offline)));
  }

  public getSubmittedUsers$(): Observable<SubmittedUser[]> {
    return this.submittedUsers$.asObservable();
  }

  public get isLoadingSubmit$(): Observable<boolean> {
    return this._isLoadingSubmit$.asObservable();
  }

  public set isLoadingSubmit(value: boolean) {
    this._isLoadingSubmit$.next(value);
  }

  public filterUsers(users: User[]): User[] {
    return this.userService.isCurrentUserFeatureLead()
      ? users.filter(user => user.role === Role.FEATURE_LEAD || user.offline)
      : [JSON.parse(sessionStorage.getItem(HttpUtils.USER_STORAGE_KEY))];
  }

  /**
   * Updates totals calculated in backend and navigates to last page
   */
  public updateIfdTotalsAndNavigate() {
    this.createIfdService
      .getExistentIfd()
      .pipe(switchMap(() => this.ifdTotalService.saveIfdTotals()))
      .subscribe(() => this.navigateToLastPage());
  }

  /**
   * Navigates to last page
   */

  public navigateToLastPage() {
    this.route.queryParams.subscribe(params => {
      const navigationModel: NavigationModel = {
        navigationActions: NavigationActionsEnum.FINISH_ESTIMATION
      };
      this.navigationService.prepareToNavigate(navigationModel);
    });
  }

  public loadCurrentTaskType() {
    this.taskJsonService.loadTasksByType(this._currentInfo.task.type).subscribe(data => {
      this.taskDescriptors = data.map(descriptor => ({
        ...descriptor,
        taskFieldInfo: descriptor.taskFieldInfo
      }));

      this.descriptions = this.taskJsonService
        .getDescriptionsByType(this._currentInfo.task.type)
        .filter(description => this.isFieldGenerated(description));
      this.initEstimations();
      if (this.descriptions.length === 0) {
        this.currentEstimationService.goToNextTask();
        this._currentInfo = this.currentEstimationService.getCurrentTask();
        if (this._currentInfo !== null) {
          this.loadCurrentTaskType();
        } else {
          if (this.userService.getSessionStorageUser().role === Role.FEATURE_LEAD) {
            this.updateIfdTotalsAndNavigate();
          }
        }
      } else {
        this.isLoaded$.next(true);
      }
    });
  }

  public initEstimations(): void {
    this.users.forEach(user =>
      this.estimations.set(
        user,
        this._currentInfo.task.taskFields.map(taskField => ({
          fieldId: taskField.id,
          id: -1,
          best: null,
          likely: null,
          worst: null,
          comments: ''
        }))
      )
    );
  }

  public isFieldImportant(description: string): boolean {
    return this.taskDescriptors.some(descriptor =>
      descriptor.taskFieldInfo.some(info => info.description === description && info.important)
    );
  }

  public isFieldGenerated(description: string): boolean {
    return this.taskDescriptors.some(descriptor =>
      descriptor.taskFieldInfo.some(info => info.description === description)
    );
  }

  public restrictInput(event: InputEvent): void {
    const inputValue = event.data;
    const validInputRegex = /^([0-9]+)?$|null/;
    if (!validInputRegex.test(inputValue)) {
      event.preventDefault();
    }
  }

  public submitEstimations(): void {
    this.isLoadingSubmit = true;
    const user: User = this.userService.getSessionStorageUser();
    this.saveEstimations()
      .pipe(switchMap(() => this.userService.submitUser({ id: user.id, callsign: user.callsign })))
      .subscribe(_ => {
        this.isLoadingSubmit = false;
      });
    const navigationModel: NavigationModel = {
      navigationActions: NavigationActionsEnum.SUBMIT_ESTIMATION,
      taskId: this._currentInfo.task.id,
      mvpId: this._currentInfo.mvpId
    };
    this.isLoadingSubmit = false;
    this.navigationService.navigate(navigationModel);
  }

  public saveEstimations(): Observable<void> {
    return this.taskEstimationService.saveEstimations(this.estimations);
  }

  public goToTheNextUser() {
    this.currentUser = this.users[++this.currentIndex];
  }

  public goToThePreviousUser() {
    this.currentUser = this.users[--this.currentIndex];
  }

  public isCurrentUserFeatureLead(): boolean {
    return this.userService.isCurrentUserFeatureLead();
  }
}
