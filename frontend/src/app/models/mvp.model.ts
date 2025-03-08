import { Task } from './task.model';
import { TotalEstimation } from './total-estimation.model';

export interface Mvp {
  id: number;
  name: string;
  tasks: Task[];
  totalEstimation?: TotalEstimation;
}
