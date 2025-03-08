import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EstimationNavigationService } from './services/estimation-navigation.service';
import { Task } from '../models/task.model';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, Observable, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

import { EstimationTableComponent } from './estimation-table/estimation-table.component';
import { LocalizationService } from '../services/localization.service';
import { TaskService } from '../create-ifd/src/services/task.service';
import { TaskJsonService } from '../services/task-categories.service';
import { UserService } from '../services/user.service';
import { TaskType } from '../models/task-type.model';
import { NavigationModel } from '../models/navigation/navigation.model';
import { NavigationActionsEnum } from '../models/navigation/navigation-actions.enum';
import { NavigationService } from '../services/navigation.service';
import { DeleteDialogComponent } from '../create-ifd/src/delete-dialog/delete-dialog.component';
import { TaskEstimationsService } from '../services/task-estimations.service';
import { CurrentEstimationService } from '../services/current-estimation.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-estimation-navigation',
  templateUrl: './estimation-navigation.component.html',
  styleUrls: ['./estimation-navigation.component.scss']
})
export class EstimationNavigationComponent implements OnInit, OnDestroy {
  public selectedMVP: string;
  public mvpId: number;
  public tasks: Task[] = [];
  public selectedTask: Task;
  public selectedTaskId: number;
  public currentTaskId: number;
  public reEstimateButton: string = '';
  public currentAction: string = '';
  private _isLoadingReest$ = new BehaviorSubject<boolean>(false);
  private _isLoadingNext$ = new BehaviorSubject<boolean>(false);
  private _isGlobalLoading$ = new BehaviorSubject<boolean>(false);

  private destroy$: Subject<void> = new Subject<void>();
  @ViewChild(EstimationTableComponent)
  private estimationTable: EstimationTableComponent;

  constructor(
    private estimationService: EstimationNavigationService,
    private currentEstimationService: CurrentEstimationService,
    private estimationNavigationService: EstimationNavigationService,
    private taskEstimationService: TaskEstimationsService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private taskJsonService: TaskJsonService,
    protected userService: UserService,
    private localizationService: LocalizationService,
    private navigationService: NavigationService,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.initializeMvpAndTasks();
    this.localizationService
      .getLocalizationValues$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.reEstimateButton = data?.REESTIMATE_BUTTON;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get isLoadingReest$(): Observable<boolean> {
    return this._isLoadingReest$.asObservable();
  }

  public get isLoadingNext$(): Observable<boolean> {
    return this._isLoadingNext$.asObservable();
  }

  public get isGlobalLoading$(): Observable<boolean> {
    return this._isGlobalLoading$.asObservable();
  }

  /**
   * Set the selected task based on tabs navigation
   * @param $event
   */
  public setSelectedTask($event: Task) {
    this.selectedTask = $event;
    this.estimationService.setSelectedTask(this.selectedTask.name);
    this.setCurrentAction();
    this.taskJsonService.loadTasksByType(this.selectedTask.type).subscribe();
  }

  /**
   * Navigate to the Submit Estimates page for the current task
   */

  public navigateToSubmit(reest: boolean): void {
    console.log('naviatereee');
    this.route.queryParams.subscribe(params => {
      const taskId = params['taskId'];
      const navigationModel: NavigationModel = {
        navigationActions: NavigationActionsEnum.START_ESTIMATION,
        taskId: taskId,
        reestimation: reest
      };
      this.navigationService.prepareToNavigate(navigationModel);
    });
  }

  public reEstimate(): void {
    this.localizationService
      .getLocalizationValues$()
      .pipe(
        switchMap(data =>
          this.dialog
            .open(DeleteDialogComponent, {
              data: {
                title: data?.REESTIMATE_DIALOG_TITLE,
                message: data?.REESTIMATE_DIALOG_MESSAGE
              }
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
        ),
        filter(result => !!result),
        switchMap(_ => {
          this._isLoadingReest$.next(true);
          this._isGlobalLoading$.next(true);
          return this.taskEstimationService.reEstimate(this.currentTaskId);
        })
      )
      .subscribe({
        next: () => {
          this.navigateToSubmit(true);
        },
        complete: () => {
          this._isLoadingReest$.next(false);
          this._isGlobalLoading$.next(false);
        }
      });
  }

  public next(): void {
    this._isLoadingNext$.next(true);
    this._isGlobalLoading$.next(true);
    this.currentEstimationService.goToNextTask();
    this.estimationTable
      .saveFinalEstimations()
      .pipe(
        take(1),
        switchMap(() => {
          this.selectedTask.estimated = true;
          return this.taskService.updateTask(this.selectedTask, this.currentTaskId);
        }),
        switchMap(() => this.estimationNavigationService.getTasks(this.mvpId))
      )
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        this.navigateToSubmit(false);
        this._isGlobalLoading$.next(false);
      });
  }

  /**
   * Initializes data for the current mvp and the selected task
   * The route should be /estimations?mvpId=2&taskId=1
   */
  public initializeMvpAndTasks(): void {
    this.route.queryParams
      .pipe(
        switchMap(params => {
          this.mvpId = Number(params['mvpId']);
          this.selectedTaskId = Number(params['taskId']);
          this.currentTaskId = Number(params['taskId']);
          return this.estimationNavigationService.getMvp(this.mvpId);
        }),
        switchMap(mvp => {
          this.selectedMVP = mvp.name;
          this.estimationService.setSelectedMvp(this.selectedMVP);
          return this.estimationNavigationService.getTasks(this.mvpId);
        }),
        tap(tasks => {
          this.tasks = tasks
            .sort((a, b) => {
              if (a.type === TaskType.STORY && b.type !== TaskType.STORY) {
                return -1;
              }
              if (a.type !== TaskType.STORY && b.type === TaskType.STORY) {
                return 1;
              }
              return 0;
            })
          this.setCurrentTask();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.setCurrentAction();
      });
  }

  /**
   * Set the current task by route param task id
   * If the task id is not included in the tasks list
   * the selected task will be the first one
   * @private
   */
  private setCurrentTask() {
    this.selectedTask = this.tasks.find(task => task.id === this.selectedTaskId);
    this.taskJsonService.loadTasksByType(this.selectedTask.type).subscribe();
    if (!this.selectedTask) {
      this.selectedTask = this.tasks[0];
    }
    this.estimationService.setSelectedTask(this.selectedTask.name);
  }

  /**
   * Set the action button name based on the tasks
   * If the active task is the last one, the action button will be 'finish'
   * Otherwise it will be 'next'
   * @private
   */
  private setCurrentAction(): void {
    const index = this.tasks.indexOf(this.selectedTask);
    const isLastItem: boolean = index === this.tasks.length - 1;
    if (isLastItem) {
      this.currentAction = 'FINISH';
    } else {
      this.currentAction = 'NEXT';
    }
  }

  public isLoaded(): Observable<boolean> {
    return this.estimationTable?.isLoaded();
  }

  public isCurrentUserFeatureLead(): boolean {
    return this.userService.isCurrentUserFeatureLead();
  }
}
