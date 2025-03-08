import { TaskFieldEstimation } from './task-field-estimation.model';

/**
 * This model is 1:1 with backend model, assigning the estimations to one user
 */
export interface UserTaskFieldEstimation {
  taskFieldEstimations: TaskFieldEstimation[];
  userId: number;
}
