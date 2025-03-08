import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject, filter, Subject, switchMap, take, takeUntil } from 'rxjs';
import { Ifd } from '../../models/ifd.model';
import { Task } from '../../models/task.model';
import { TotalEstimation } from '../../models/total-estimation.model';
import { IfdTotalService } from '../services/ifd-total.service';
import { Mvp } from '../../models/mvp.model';
import { CreateIfdService } from '../../create-ifd/src/services/create-ifd.service';
import { EstimationState } from '../../models/estimation-state.model';
import { UserService } from '../../services/user.service';
import { NotificationTopicsUtils } from '../../utils/notification-topics.utils';
import { NotificationStompService } from '../../services/notifications/notification-stomp.service';
import { MatInput } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-estimations-table',
  templateUrl: './estimations-table.component.html',
  styleUrls: ['./estimations-table.component.scss']
})
export class EstimationsTableComponent implements OnInit, OnDestroy {
  public ifd: Ifd;
  public dataSource: {
    mvp: Mvp;
    dataSource: MatTableDataSource<Task>;
  }[];
  public ifdDataSource: MatTableDataSource<{
    name: string;
    totalEstimation: TotalEstimation;
  }>;
  public columns: string[] = ['category', 'best', 'likely', 'worst', '95%', 'comments'];
  // TODO 3.a. create isInEditMode$ subject
  public showToast$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isChanged$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _destroy$: Subject<void> = new Subject<void>();
  public _dashboardState: EstimationState;
  protected readonly EstimationState = EstimationState;
  @ViewChildren(MatInput, { read: ElementRef })
  private inputs: QueryList<ElementRef>;

  constructor(
    private createIfdService: CreateIfdService,
    private ifdTotalService: IfdTotalService,
    protected userService: UserService,
    private notificationService: NotificationStompService
  ) {
    this.notificationService
      .isSocketReady()
      .pipe(
        take(1),
        switchMap(() =>
          this.notificationService.subscribeToTopic<Ifd>(NotificationTopicsUtils.LAST_ESTIMATIONS_NOTIFICATION_TOPIC)
        ),
        takeUntil(this._destroy$)
      )
      .subscribe(
        notification => this.updateDataSource(notification.data),
        error => console.log(error)
      );
  }

  ngOnInit(): void {
    this.createIfdService.getExistentIfd().subscribe(ifd => {
      if (!!ifd) {
        this.updateDataSource(ifd);
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public updateDataSource(ifd: Ifd) {
    this.ifd = ifd;
    this.ifdDataSource = new MatTableDataSource<{ name: string; totalEstimation: TotalEstimation }>([
      ...this.ifd.mvps.map(mvp => ({
        name: mvp.name,
        totalEstimation: mvp.totalEstimation
      })),
      { name: 'Project total', totalEstimation: this.ifd.totalEstimation }
    ]);

    this.dataSource = this.ifd?.mvps.map(mvp => {
      return { mvp, dataSource: new MatTableDataSource(mvp.tasks) };
    });
  }

  public isCurrentUserFeatureLead(): boolean {
    return this.userService.isCurrentUserFeatureLead();
  }

  // TODO 3.b. emit value when clicking on the button
  public goIntoEditMode(): void {}

  // TODO 3.e. create save method
  public saveEditedItems(): void {}

  // TODO 3.f. create cancel method
  public cancel(): void {}

  /**
   * Updates the values of the total estimations (in frontend only)
   * @param item
   * @param row
   * @param field
   * @param event
   */

  public update(item: Mvp, row: Task, field: string, event: Event): void {
    this.isChanged$.next(true);
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (typeof value === 'number' && !isNaN(value) && !!row.totalEstimation) {
      row.totalEstimation[field as keyof TotalEstimation] = value;
      row.totalEstimation.riskBuffer = this.getRiskBufferOfEstimation(row.totalEstimation);
    }
    item.totalEstimation = this.generateTotalEstimation(
      this.sumField(item.tasks, 'best'),
      this.sumField(item.tasks, 'likely'),
      this.sumField(item.tasks, 'worst'),
      0
    );
    item.totalEstimation.riskBuffer = this.getRiskBufferOfEstimation(item.totalEstimation);
    this.ifd.totalEstimation = this.generateTotalEstimation(
      this.sumFieldForIfd(this.ifd.mvps, 'best'),
      this.sumFieldForIfd(this.ifd.mvps, 'likely'),
      this.sumFieldForIfd(this.ifd.mvps, 'worst'),
      this.sumFieldForIfd(this.ifd.mvps, 'riskBuffer')
    );
  }

  public getRiskBufferOfEstimation(totalEstimation: TotalEstimation): number {
    return (
      (totalEstimation.best + 4 * totalEstimation.likely + totalEstimation.worst) / 6 +
      (2 * (totalEstimation.worst - totalEstimation.best)) / 6
    );
  }

  /**
   * Generates a total estimation object based on parameter values
   * @param best
   * @param likely
   * @param worst
   * @param riskBuffer
   */
  public generateTotalEstimation(best: number, likely: number, worst: number, riskBuffer: number): TotalEstimation {
    return {
      best: best,
      likely: likely,
      worst: worst,
      riskBuffer: riskBuffer
    };
  }

  /**
   * Calculates the sum when it is updated in frontend by user
   * @param tasks
   * @param field
   * @private
   */
  private sumField(tasks: Task[], field: keyof TotalEstimation): number {
    return tasks.reduce((total, task) => {
      if (field in task.totalEstimation) {
        return total + task.totalEstimation[field];
      }
      return total;
    }, 0);
  }

  /**
   * Calculates the sum for ifd totals when it is updated in frontend by user
   * @param tasks
   * @param field
   * @private
   */
  private sumFieldForIfd(mvps: Mvp[], field: keyof TotalEstimation): number {
    return mvps.reduce((total, mvp) => {
      if (field in mvp.totalEstimation) {
        return total + mvp.totalEstimation[field];
      }
      return total;
    }, 0);
  }

  public restrictInput(data: string): void {
    const validInputRegex = /^([0-9]+)?$|null/;
    if (!validInputRegex.test(data)) {
      event.preventDefault();
    }
  }

  updateComments(row: Task, $event: Event) {
    this.isChanged$.next(true);
    const input: HTMLInputElement = $event.target as HTMLInputElement;
    row.comments = input.value;
  }

  public onAnimationEnd(): void {
    this.showToast$.next(false);
  }
}
