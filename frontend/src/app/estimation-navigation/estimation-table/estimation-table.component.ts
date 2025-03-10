import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { isEqual } from 'lodash';
import { KeyValue } from '@angular/common';

import { TaskRow } from '../models/task-row';
import { Task } from '../../models/task.model';
import { TaskService } from '../../create-ifd/src/services/task.service';
import { TaskJsonService } from '../../services/task-categories.service';
import { TaskFieldEstimation } from '../../models/task-field-estimation.model';
import { LocalizationService } from '../../services/localization.service';
import { ViewCommentsDialogComponent } from '../view-comments-dialog/view-comments-dialog.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { EstimationNavigationService } from '../services/estimation-navigation.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-estimation-table',
  templateUrl: './estimation-table.component.html',
  styleUrls: ['./estimation-table.component.scss']
})
export class EstimationTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input('selectedTask') selectedTask: Task;

  public taskRows: { [keyName: string]: TaskRow } = {};
  public totals: { [callsign: string]: TaskFieldEstimation } = {};
  public finalEstimates: { [keyName: string]: TaskFieldEstimation } = {};
  public allCallsigns: string[] = [];
  public finalTotals: TaskFieldEstimation = { best: 0, likely: 0, worst: 0 };
  protected _currentTask: Task;
  private destroy$: Subject<void> = new Subject<void>();
  public users: User[] = [];
  public activeBestIndexes: { [rowIndex: number]: { userIndex: number } } = {};
  public activeLikelyIndexes: { [rowIndex: number]: { userIndex: number } } = {};
  public activeWorstIndexes: { [rowIndex: number]: { userIndex: number } } = {};
  public readonly labels: string[] = ['B', 'L', 'W'];
  public isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private estimationNavigationService: EstimationNavigationService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private localizationService: LocalizationService,
    public taskJsonService: TaskJsonService,
    public userService: UserService,
    private dialog: MatDialog
  ) {}

  public ngOnInit() {
    this.initializeFinalEstimates();
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    this.route.queryParams
      .pipe(
        switchMap(params => {
          const taskId = params['taskId'];
          return this.taskService.getTask(taskId).pipe();
        })
      )
      .subscribe(task => (this._currentTask = task));
  }

  public isLoaded(): Observable<boolean> {
    return this.isLoaded$.asObservable();
  }

  public isCurrentUserFeatureLead(): boolean {
    return this.userService.isCurrentUserFeatureLead();
  }

  public isCurrentTaskSelected(): boolean {
    return this._currentTask?.id === this.selectedTask?.id;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.initializeFinalEstimates();
    this.loadEstimationData();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fetches task estimation data and processes it for table display.
   */
  private loadEstimationData(): void {
    this.initializeFinalEstimates();
    if (!!this.selectedTask) {
      this.isLoaded$.next(false);
      this.estimationNavigationService
        .getTaskDetails(this.selectedTask.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          const processedData = this.estimationNavigationService.processDataToTable(data);
          this.taskRows = processedData.rows;
          this.totals = processedData.totals;
          this.allCallsigns = Object.keys(this.totals);
          this.finalEstimates = processedData.finalEstimates;
          this.isLoaded$.next(true);
        });
    }
  }

  // TODO 2.c. sort rows based on id

  public saveFinalEstimations() {
    const finalEstimations: TaskFieldEstimation[] = Object.keys(this.finalEstimates).map(key => {
      const value: TaskFieldEstimation = this.finalEstimates[key];
      const fieldId: number = this._currentTask.taskFields.find(taskField => taskField.keyName === key)?.id;
      return { best: value.best, likely: value.likely, worst: value.worst, fieldId: fieldId };
    });
    return this.estimationNavigationService.saveData(finalEstimations);
  }

  // TODO ex 2.a. create a method to calculate totals for each keyname based on finalEstimates
  // TODO ex 2.b. call the method when needed
  public calculateTotals(): void {}

  public changeBestEstimate(key: string, value: number, index: number, userIndex: number) {
    if (isEqual(this.activeBestIndexes[index], { userIndex: userIndex })) {
      this.setBestEstimate(key, 0, index, -1);
    } else {
      this.setBestEstimate(key, value, index, userIndex);
    }
  }

  public changeLikelyEstimate(key: string, value: number, index: number, userIndex: number) {
    if (isEqual(this.activeLikelyIndexes[index], { userIndex: userIndex })) {
      this.setLikelyEstimate(key, 0, index, -1);
    } else {
      this.setLikelyEstimate(key, value, index, userIndex);
    }
  }

  public changeWorstEstimate(key: string, value: number, index: number, userIndex: number) {
    if (isEqual(this.activeWorstIndexes[index], { userIndex: userIndex })) {
      this.setWorstEstimate(key, 0, index, -1);
    } else {
      this.setWorstEstimate(key, value, index, userIndex);
    }
  }

  public setBestEstimate(key: string, value: number, index: number, userIndex: number): void {
    this.activeBestIndexes[index] = { userIndex: userIndex };
    this.finalEstimates[key].best = value;
  }

  public setLikelyEstimate(key: string, value: number, index: number, userIndex: number): void {
    this.activeLikelyIndexes[index] = { userIndex: userIndex };
    this.finalEstimates[key].likely = value;
  }

  public setWorstEstimate(key: string, value: number, index: number, userIndex: number): void {
    this.activeWorstIndexes[index] = { userIndex: userIndex };
    this.finalEstimates[key].worst = value;
  }

  private initializeFinalEstimates(): void {
    for (const keyName in this.taskRows) {
      this.finalEstimates[keyName] = { best: 0, likely: 0, worst: 0 };
    }
  }

  public getComments(key: string): { comment: string; user: User }[] {
    const comments: { comment: string; user: User }[] = [];

    this.selectedTask?.taskFields
      .find(taskField => taskField.keyName === key)
      ?.taskFieldEstimations.forEach(taskEstimation => {
        const user = this.users.find(user =>
          user.taskFieldEstimations?.some(estimation => estimation.id === taskEstimation.id)
        );

        if (taskEstimation.comments && user) {
          comments.push({
            comment: taskEstimation.comments,
            user: user
          });
        }
      });

    return comments;
  }

  public addComment(): void {
    this.localizationService
      .getLocalizationValues$()
      .pipe(
        switchMap(data => {
          const title = data.COMMENT_DIALOG_HEADER;
          return this.dialog
            .open(CommentDialogComponent, {
              data: {
                title: title,
                task: this.selectedTask
              }
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$));
        }),
        switchMap((updatedTask: Task) => {
          if (updatedTask) {
            this.selectedTask.comments = updatedTask.comments;
            return this.estimationNavigationService.updateTaskComments(this.selectedTask);
          } else {
            return of();
          }
        })
      )
      .subscribe();
  }

  public showComments(key: string) {
    this.localizationService
      .getLocalizationValues$()
      .pipe(
        switchMap(data => {
          const title = data.VIEW_COMMENT_DIALOG_HEADER;
          return this.dialog
            .open(ViewCommentsDialogComponent, {
              data: {
                title: title,
                comments: this.getComments(key).map(item => ({
                  user: item.user.callsign,
                  comment: item.comment
                }))
              }
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$));
        })
      )
      .subscribe(() => {});
  }

  public deselectBest(i: number, userIndex: number) {
    this.activeBestIndexes[i] = { userIndex: userIndex };
  }

  public deselectLikely(i: number, userIndex: number) {
    this.activeLikelyIndexes[i] = { userIndex: userIndex };
  }

  public deselectWorst(i: number, userIndex: number) {
    this.activeWorstIndexes[i] = { userIndex: userIndex };
  }

}
