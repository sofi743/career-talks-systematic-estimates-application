import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Task } from '../../../models/task.model';
import { HttpUtils } from '../../../utils/http.utils';

//todo to be renamed in task-api.service
/**
 * API service that handles task REST calls to database
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly taskUrl: string = 'tasks';
  private readonly saveEndpoint: string = 'save';
  private readonly updateEndpoint: string = 'update';
  private readonly findEndpoint: string = 'find';
  private readonly getTasksByMvpEndpoint: string = 'find-by-mvp';
  private readonly updateCommentsEndpoint: string = 'update-comments';
  private readonly port: string = '8080'; // Hardcoded port

  constructor(private http: HttpClient) {}

  public addTask(task: Task, id: number): Observable<Task> {
    return this.http.post<Task>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.taskUrl}/${this.saveEndpoint}`,
      task,
      {
        params: { id }
      }
    );
  }

  public deleteTask(task: Task) {
    return this.http.delete<void>(`http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.taskUrl}/delete`, {
      params: { id: task.id }
    });
  }

  public updateTask(task: Task, id: number): Observable<Task> {
    return this.http.put<Task>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.taskUrl}/${this.updateEndpoint}`,
      task,
      {
        params: { id }
      }
    );
  }

  public getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.taskUrl}/${this.findEndpoint}`, {
      params: { id }
    });
  }

  public getTasks(mvpId: number): Observable<Task[]> {
    const url = `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.taskUrl}/${this.getTasksByMvpEndpoint}`;
    return this.http.get<Task[]>(url, { params: { mvpId } });
  }

  public updateTaskComments(task: Task): Observable<Task> {
    return this.http.put<Task>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.taskUrl}/${this.updateCommentsEndpoint}`,
      task
    );
  }
}
