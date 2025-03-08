import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Mvp } from '../../../models/mvp.model';
import { Ifd } from '../../../models/ifd.model';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  finalize,
  map,
  Observable,
  Subject,
  take,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import { CreateIfdService } from '../services/create-ifd.service';
import { MvpService } from '../services/mvp.service';
import { DefaultsUtils } from '../../../utils/defaults.utils';
import { TaskJsonService } from '../../../services/task-categories.service';
import { Task } from '../../../models/task.model';
import { TaskFieldDescriptor } from '../../../models/task-field-descriptor.model';
import { LocalizationService } from '../../../services/localization.service';
import { MvpComponent } from '../mvp/mvp.component';
import { EstimationState } from '../../../models/estimation-state.model';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { OfflineUserDialogComponent } from '../offline-user-dialog/offline-user-dialog.component';
import { Role } from '../../../models/role.model';
import { ConfigurationService } from '../services/configuration.service';
import { Configuration } from '../../../models/configuration.model';
import { JoinService } from '../../../services/join.service';
import { NavigationService } from '../../../services/navigation.service';
import { NavigationModel } from '../../../models/navigation/navigation.model';
import { NavigationActionsEnum } from '../../../models/navigation/navigation-actions.enum';
import { CurrentInfoModel } from '../../../models/current-info.model';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CurrentEstimationService } from '../../../services/current-estimation.service';

@Component({
  selector: 'app-ifd',
  templateUrl: './create-ifd.component.html',
  styleUrls: ['./create-ifd.component.scss']
})
export class CreateIfdComponent implements OnInit, OnDestroy {
  public ifd: Ifd;
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isLoadingStart$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  public startButton: string = '';
  private usersPerPage = 6;
  public currentPage$ = new BehaviorSubject<number>(0);
  public totalPages: number = 1;
  public title: string;
  public dialogTitle: string;
  public dialogMessage: string;
  private users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  @ViewChildren(MvpComponent) mvpComponents: QueryList<MvpComponent>;

  constructor(
    private currentEstimationService: CurrentEstimationService,
    private taskJsonService: TaskJsonService,
    private route: ActivatedRoute,
    private createIfdService: CreateIfdService,
    private mvpService: MvpService,
    private localizationService: LocalizationService,
    private userService: UserService,
    private dialog: MatDialog,
    protected configurationService: ConfigurationService,
    private joinService: JoinService,
    private navigationService: NavigationService
  ) {
    this.joinService
      .getUserList$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => this.setUsers$(users));
    this.localizationService
      .getLocalizationValues$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dialogTitle = data?.DIALOG_TITLE;
        this.dialogMessage = data?.DIALOG_MESSAGE;
        this.startButton = data?.START_BUTTON;
        this.title = data?.CREATE_IFD_TITLE;
      });
    this.taskJsonService
      .loadNonStoryTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(nonStoryTasks => {
        const mappedNonStoryTasks = nonStoryTasks.map(descriptor => this.mapDescriptorToTask(descriptor));
        DefaultsUtils.updateDefaultMvpWithTasks(mappedNonStoryTasks);
      });
  }

  public ngOnInit(): void {
    this.getIfd();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setUsers$(users: User[]): void {
    this.users$.next(users);
    this.updateTotalPages(users);
  }

  public getPaginatedUsers$(): Observable<User[]> {
    return combineLatest([this.users$, this.currentPage$]).pipe(
      map(([users, currentPage]) => {
        const startIndex = currentPage * this.usersPerPage;
        return users.slice(startIndex, startIndex + this.usersPerPage);
      })
    );
  }

  private updateTotalPages(users: User[]): void {
    this.totalPages = Math.ceil(users.length / this.usersPerPage); // Calculate total pages
  }

  public getCurrentPage$(): Observable<number> {
    return this.currentPage$.asObservable();
  }

  public nextPage(): void {
    if (this.currentPage$.getValue() < this.totalPages - 1) {
      this.currentPage$.next(this.currentPage$.getValue() + 1);
    }
  }

  public previousPage(): void {
    if (this.currentPage$.getValue() > 0) {
      this.currentPage$.next(this.currentPage$.getValue() - 1);
    }
  }

  private goToLastPage(): void {
    const lastPage = Math.max(0, Math.ceil(this.users$.getValue().length / this.usersPerPage) - 1);
    this.currentPage$.next(lastPage); // Set currentPage to the last page index
  }

  public get isLoadingStart$(): Observable<boolean> {
    return this._isLoadingStart$.asObservable();
  }

  public set isLoadingStart(value: boolean) {
    this._isLoadingStart$.next(value);
  }

  public expandAll(): void {
    this.mvpComponents.forEach(mvpComponent => mvpComponent.expand());
  }

  public collapseAll(): void {
    this.mvpComponents.forEach(mvpComponent => mvpComponent.collapse());
  }

  public get isLoading$(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public set isLoading(value: boolean) {
    this._isLoading$.next(value);
  }

  public addMvp(): void {
    this.isLoading = true;
    this.mvpService
      .addMvp(DefaultsUtils.DEFAULT_MVP)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (mvp: Mvp) => {
          if (!!mvp) {
            this.ifd.mvps.push(mvp);
            // timeout to wait until the new mvp is rendered
            setTimeout(() => {
              this.mvpComponents.filter(mvpComponent => mvpComponent.datasource === mvp).forEach(mvp => mvp.expand());
            }, 0.3);
          }
        },
        error => {
          console.error('Error adding MVP:', error);
        }
      );
  }

  public getConfiguration(): Observable<Configuration> {
    return this.configurationService.configuration$;
  }

  private mapDescriptorToTask(descriptor: TaskFieldDescriptor): Task {
    return {
      id: -1,
      name: descriptor.label,
      type: descriptor.type,
      estimated: false,
      taskFields: descriptor.taskFieldInfo.map(field => ({
        id: -1,
        keyName: field.keyName,
        description: field.description,
        important: field.important,
        taskFieldEstimations: []
      }))
    };
  }

  public startEstimation(): void {
    this.isLoadingStart = true;
    this.route.queryParams
      .pipe(
        finalize(() => (this.isLoadingStart = false)),
        takeUntil(this.destroy$),
        switchMap(() => this.currentEstimationService.populateTaskArray())
      )
      .subscribe((data: CurrentInfoModel[]) => {
        const taskId = data[0]?.task.id;
        const navigationModel: NavigationModel = {
          navigationActions: NavigationActionsEnum.START_ESTIMATION,
          taskId: taskId,
          reestimation: true
        };
        this.navigationService.prepareToNavigate(navigationModel);
      });
  }

  public getIfd(): void {
    this.isLoading = true;
    this.createIfdService
      .getAndInitializeIfd()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (data: Ifd) => {
          this.ifd = data;
        },
        error => {
          console.error('There was an error!', error);
        }
      );
  }

  public addOfflineUser() {
    const dialogRef = this.dialog.open(OfflineUserDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter(result => !!result),
        switchMap(dialogResult => {
          return this.userService.registerUser(dialogResult.callsign, Role.PARTICIPANT, true);
        })
      )
      .subscribe(() => this.goToLastPage());
  }

  public deleteUser(user: User) {
    this.dialog
      .open(DeleteDialogComponent, {
        data: { title: `${this.dialogTitle} ${user.callsign.toUpperCase()}?`, message: this.dialogMessage }
      })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(() => {
          return this.userService.deleteUser(user.id).pipe(switchMap(() => this.userService.getUsers()));
        })
      )
      .subscribe(users => {
        const currentPageIndex = this.currentPage$.getValue();
        const startIndex = currentPageIndex * this.usersPerPage;
        const usersOnCurrentPage = users.slice(startIndex, startIndex + this.usersPerPage);
        if (usersOnCurrentPage.length === 0 && currentPageIndex > 0) {
          this.previousPage();
        }
      });
  }
}
