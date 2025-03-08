import { TaskFieldEstimation } from '../../models/task-field-estimation.model';

export interface TaskRow {
  [callsign: string]: TaskFieldEstimation;
}
