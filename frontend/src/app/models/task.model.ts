import { TaskType } from './task-type.model';
import { TaskField } from './task-field.model';
import { TotalEstimation } from './total-estimation.model';

export interface Task {
  id: number;
  name: string;
  comments?: string;
  type: TaskType;
  estimated: boolean;
  taskFields: TaskField[];
  totalEstimation?: TotalEstimation;
}
