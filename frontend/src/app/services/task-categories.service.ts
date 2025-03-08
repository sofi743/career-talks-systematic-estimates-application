import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TaskType } from '../models/task-type.model';
import { TaskFieldDescriptor, TaskFieldInfo } from '../models/task-field-descriptor.model';

@Injectable({
  providedIn: 'root'
})
export class TaskJsonService {
  private readonly tasksJsonUrl = '../../assets/jsons/estimation-categories.json';
  private taskDescriptors$ = new BehaviorSubject<TaskFieldDescriptor[]>([]);
  private _taskDescriptors: TaskFieldDescriptor[];
  private categoriesSubject$: ReplaySubject<TaskFieldDescriptor[]> = new ReplaySubject<TaskFieldDescriptor[]>();

  constructor(private http: HttpClient) {}

  private setTaskDescriptors(taskDescriptors: TaskFieldDescriptor[]): void {
    this._taskDescriptors = taskDescriptors;
    this.taskDescriptors$.next(taskDescriptors);
  }

  public start(): void {
    this.http.get<TaskFieldDescriptor[]>(this.tasksJsonUrl).subscribe(data => this.categoriesSubject$.next(data));
  }

  public getCategories$() {
    return this.categoriesSubject$.asObservable();
  }

  public loadTasksByType(taskType: TaskType): Observable<TaskFieldDescriptor[]> {
    return this.getCategories$().pipe(
      map(data => this.mapTasks(data).filter(task => task.type === taskType)),
      catchError(this.handleError<TaskFieldDescriptor[]>('loadTasksByType', []))
    );
  }

  public getDescriptionsByType(taskType: TaskType): string[] {
    const currentDescriptors = this.taskDescriptors$.getValue();
    return currentDescriptors
      .filter(descriptor => descriptor.type === taskType)
      .flatMap(descriptor => descriptor.taskFieldInfo.map(info => info.description));
  }

  public loadNonStoryTasks(): Observable<TaskFieldDescriptor[]> {
    return this.getCategories$().pipe(
      map(data => data.filter(descriptor => descriptor.type !== TaskType.STORY)),
      catchError(this.handleError<TaskFieldDescriptor[]>('loadNonStoryTasks', []))
    );
  }

  public loadStoryTask(): Observable<TaskFieldDescriptor[]> {
    return this.getCategories$().pipe(
      map(data => data.filter(descriptor => descriptor.type === TaskType.STORY)),
      catchError(this.handleError<TaskFieldDescriptor[]>('loadStoryTasks', []))
    );
  }

  private mapTasks(data: TaskFieldDescriptor[]): TaskFieldDescriptor[] {
    if (!data || !data.length) {
      console.error('No data or empty data array.');
      this.setTaskDescriptors([]);
      return [];
    }
    if (!data[0].taskFieldInfo) {
      console.error('Data does not contain taskFieldInfo.');
      this.setTaskDescriptors([]);
      return [];
    }
    const mappedTasks = data.map(
      task =>
        ({
          label: task.label,
          type: task.type as TaskType,
          taskFieldInfo: task.taskFieldInfo.map(
            (field: TaskFieldInfo) =>
              ({
                keyName: field.keyName,
                description: field.description,
                important: field.important,
              } as TaskFieldInfo)
          )
        } as TaskFieldDescriptor)
    );
    this.setTaskDescriptors(mappedTasks);
    return mappedTasks;
  }

  public getLabelOfKey(key: string): string {
    for (const descriptor of this._taskDescriptors) {
      const foundTaskFieldInfo = descriptor.taskFieldInfo.find(taskFieldInfo => taskFieldInfo.keyName === key);
      if (foundTaskFieldInfo) {
        return foundTaskFieldInfo.description;
      }
    }
    return undefined;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      this.setTaskDescriptors(result as TaskFieldDescriptor[]);
      return of(result as T);
    };
  }
}
