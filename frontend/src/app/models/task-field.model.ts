import { TaskFieldEstimation } from './task-field-estimation.model';

export interface TaskField {
  id: number;
  keyName: string;
  taskFieldEstimations: TaskFieldEstimation[];
}
