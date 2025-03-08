import { Mvp } from '../models/mvp.model';
import { Task } from '../models/task.model';
import { TaskType } from '../models/task-type.model';

export class DefaultsUtils {
  static DEFAULT_MVP: Mvp = {
    tasks: [],
    id: -1,
    name: '',
    totalEstimation: { best: 0, likely: 0, worst: 0, riskBuffer: 0 }
  };
  static DEFAULT_TASK: Task = {
    id: -1,
    name: '',
    type: TaskType.STORY,
    taskFields: [],
    totalEstimation: { best: 0, likely: 0, worst: 0, riskBuffer: 0 },
    estimated: false
  };

  static updateDefaultMvpWithTasks(nonStoryTasks: Task[]): void {
    this.DEFAULT_MVP.tasks = nonStoryTasks;
  }

  static updateDefaultTaskFields(storyTask: Task): void {
    this.DEFAULT_TASK = storyTask;
  }
}
