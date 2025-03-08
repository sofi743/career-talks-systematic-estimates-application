import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { TaskRow } from '../models/task-row';
import { TaskDetail } from '../models/task-detail';
import { ProcessedData } from '../models/processed-data';
import { TaskFieldEstimation } from '../../models/task-field-estimation.model';
import { EstimationNavigationApiService } from './estimation-navigation-api.service';
import { Task } from '../../models/task.model';
import { Mvp } from '../../models/mvp.model';

/**
 * Handles estimation overview logic
 */
@Injectable({
  providedIn: 'root'
})
export class EstimationNavigationService {
  private selectedMvp$: ReplaySubject<string> = new ReplaySubject<string>();
  private selectedTask$: ReplaySubject<string> = new ReplaySubject<string>();
  private readonly hiddenFields: string[] = ['FINDINGS', 'FINDINGS_MANUAL_TESTING'];

  constructor(private estimationNavigationApiService: EstimationNavigationApiService) {}

  /**
   * Processes raw task details for table display.
   * @param taskDetails Array of task details for a specific task.
   * @returns the processed data including rows, totals, and final estimates.
   */
  public processDataToTable(taskDetails: TaskDetail[]): ProcessedData {
    const tasks: { [keyName: string]: TaskRow } = {}; // Rows of the task details
    const totals: { [callsign: string]: TaskFieldEstimation } = {}; // Totals for each callsign.
    const finalEstimates: { [keyName: string]: TaskFieldEstimation } = {}; // Final estimates for each row

    taskDetails.forEach(detail => {
      if (this.hiddenFields.includes(detail.keyName)) {
        return;
      }

      if (!tasks[detail.keyName]) {
        tasks[detail.keyName] = {};
        finalEstimates[detail.keyName] = { best: 0, likely: 0, worst: 0 };
      }

      if (!totals[detail.callsign]) {
        totals[detail.callsign] = { best: 0, likely: 0, worst: 0 };
      }

      // Assign estimates to the corresponding task and callsign.
      if (!tasks[detail.keyName][detail.callsign]) {
        tasks[detail.keyName][detail.callsign] = {
          best: detail.best,
          likely: detail.likely,
          worst: detail.worst
        };
      } else {
        tasks[detail.keyName][detail.callsign].best += detail.best;
        tasks[detail.keyName][detail.callsign].likely += detail.likely;
        tasks[detail.keyName][detail.callsign].worst += detail.worst;
      }

      // Totals for each callsign
      totals[detail.callsign].best += detail.best;
      totals[detail.callsign].likely += detail.likely;
      totals[detail.callsign].worst += detail.worst;
    });

    return { rows: tasks, totals, finalEstimates };
  }

  public setSelectedMvp(value: string): void {
    this.selectedMvp$.next(value);
  }

  public getSelectedMvp$(): Observable<string> {
    return this.selectedMvp$.asObservable();
  }

  public setSelectedTask(value: string): void {
    this.selectedTask$.next(value);
  }

  public getSelectedTask$(): Observable<string> {
    return this.selectedTask$.asObservable();
  }

  public getMvp(id: number): Observable<Mvp> | undefined {
    return this.estimationNavigationApiService.getMvp(id);
  }

  public getTasks(mvpId: number): Observable<Task[]> {
    return this.estimationNavigationApiService.getTasks(mvpId);
  }

  public saveData(finalEstimations: TaskFieldEstimation[]): Observable<void> {
    return this.estimationNavigationApiService.saveData(finalEstimations);
  }

  public updateTaskComments(task: Task): Observable<Task> {
    return this.estimationNavigationApiService.updateTaskComments(task);
  }

  public getTaskDetails(taskId: number): Observable<TaskDetail[]> {
    return this.estimationNavigationApiService.getTaskDetails(taskId);
  }
}
