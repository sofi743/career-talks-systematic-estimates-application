import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { TaskEstimationsApiService } from './task-estimations-api.service';
import { Task } from '../models/task.model';
import { TaskField } from '../models/task-field.model';
import { User } from '../models/user.model';
import { TaskFieldEstimation } from '../models/task-field-estimation.model';
import { UserTaskFieldEstimation } from '../models/user-task-field.estimation';

/**
 * Handles task fields estimations methods that are sending requests to database
 */
@Injectable({
  providedIn: 'root'
})
export class TaskEstimationsService {
  constructor(private taskEstimationsApiService: TaskEstimationsApiService) {}

  public reEstimate(currentTaskId: number): Observable<void> {
    return this.taskEstimationsApiService.getParentTask(currentTaskId).pipe(
      map((task: Task) => task.taskFields.map((taskField: TaskField) => taskField.id)),
      switchMap(taskFieldsIds => this.taskEstimationsApiService.deleteEstimationsByTaskFields(taskFieldsIds))
    );
  }

  public saveEstimations(estimations: Map<User, TaskFieldEstimation[]>): Observable<void> {
    let estimationsArray: UserTaskFieldEstimation[] = [];
    for (const [user, taskFieldEstimationArray] of estimations.entries()) {
      const dto: UserTaskFieldEstimation = { taskFieldEstimations: taskFieldEstimationArray, userId: user?.id };
      estimationsArray.push(dto);
    }

    return this.taskEstimationsApiService.saveBulkEstimations(estimationsArray);
  }
}
