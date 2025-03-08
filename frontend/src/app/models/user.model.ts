import { Role } from './role.model';
import { TaskFieldEstimation } from './task-field-estimation.model';

export interface User {
  id?: number;
  callsign: string;
  role: Role;
  taskFieldEstimations?: TaskFieldEstimation[];
  offline: boolean;
}
