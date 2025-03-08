import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';

import { Mvp } from '../../models/mvp.model';
import { UserService } from '../../services/user.service';
import { TaskFieldEstimation } from '../../models/task-field-estimation.model';
import { UserTaskFieldEstimation } from '../../models/user-task-field.estimation';
import { TaskEstimationsApiService } from '../../services/task-estimations-api.service';
import { TaskDetail } from '../models/task-detail';
import { MvpService } from '../../create-ifd/src/services/mvp.service';
import { Task } from '../../models/task.model';
import { TaskService } from '../../create-ifd/src/services/task.service';

/**
 * API wrapper for estimation overview service
 */
@Injectable({
  providedIn: 'root'
})
export class EstimationNavigationApiService {
  constructor(
    private userService: UserService,
    private taskEstimationApiService: TaskEstimationsApiService,
    private mvpService: MvpService,
    private taskService: TaskService
  ) {}

  public getMvp(id: number): Observable<Mvp> | undefined {
    return this.mvpService.findMvp(id).pipe(
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  public getTasks(mvpId: number): Observable<Task[]> {
    return this.taskService.getTasks(mvpId);
  }

  public updateTaskComments(task: Task): Observable<Task> {
    return this.taskService.updateTaskComments(task);
  }

  public saveData(finalEstimations: TaskFieldEstimation[]) {
    return this.userService.getFinalUser().pipe(
      map(user => {
        const userTaskFieldEstimations: UserTaskFieldEstimation[] = [];
        const finalUserTaskEstimation: UserTaskFieldEstimation = {
          userId: user.id,
          taskFieldEstimations: finalEstimations
        };
        userTaskFieldEstimations.push(finalUserTaskEstimation);
        return userTaskFieldEstimations;
      }),
      switchMap((userTaskFieldEstimations: UserTaskFieldEstimation[]) => {
        return this.taskEstimationApiService.saveBulkEstimations(userTaskFieldEstimations);
      })
    );
  }

  public getTaskDetails(taskId: number): Observable<TaskDetail[]> {
    return this.taskEstimationApiService.getTaskDetails(taskId);
  }
}
