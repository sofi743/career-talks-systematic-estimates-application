import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpUtils } from '../utils/http.utils';
import { InitializationService } from './initialization.service';
import { UserTaskFieldEstimation } from '../models/user-task-field.estimation';
import { TaskService } from '../create-ifd/src/services/task.service';
import { Task } from '../models/task.model';
import { TaskDetail } from '../models/task-detail';

/**
 * API service to manage task fields estimations REST calls to database
 */
@Injectable({
  providedIn: 'root'
})
export class TaskEstimationsApiService {
  private readonly taskFieldEstimationsUrl: string = 'task-estimations';
  private readonly deleteByTaskFieldEndpoint: string = 'delete-by-taskfield';
  private readonly getEstimationsURL: string = 'estimations';
  private readonly saveAllEndpoint: string = 'save-all';

  constructor(
    private initializationService: InitializationService,
    private taskService: TaskService,
    private http: HttpClient
  ) {}

  public deleteEstimationsByTaskFields(taskFieldsIds: number[]): Observable<void> {
    const options = { body: taskFieldsIds };
    return this.http.delete<void>(
      `http://${HttpUtils.HOSTNAME_URL}:8080/${this.taskFieldEstimationsUrl}/${this.deleteByTaskFieldEndpoint}`,
      options
    );
  }

  /**
   * Fetches detailed task estimation data for a given task ID.
   * @param taskId The id of the task.
   * @returns Observable that emits the array of task details.
   */
  public getTaskDetails(taskId: number): Observable<TaskDetail[]> {
    const url = `http://${HttpUtils.HOSTNAME_URL}:8080/${this.taskFieldEstimationsUrl}/${this.getEstimationsURL}`;
    return this.http.get<TaskDetail[]>(url, { params: { taskId } });
  }

  public saveBulkEstimations(userTaskFieldEstimations: UserTaskFieldEstimation[]): Observable<void> {
    return this.http.post<void>(
      `http://${HttpUtils.HOSTNAME_URL}:8080/${this.taskFieldEstimationsUrl}/${this.saveAllEndpoint}`,
      userTaskFieldEstimations
    );
  }

  public getParentTask(currentTaskId: number): Observable<Task> {
    return this.taskService.getTask(currentTaskId);
  }
}
