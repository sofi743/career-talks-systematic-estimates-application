import { TaskType } from './task-type.model';

/**
 * Interface that describes each task field estimation present in json
 */
export interface TaskFieldInfo {
  keyName: string;
  description: string;
  important: boolean;
}

/**
 * Interface that describes each task present in json
 */
export interface TaskFieldDescriptor {
  type: TaskType;
  taskFieldInfo: TaskFieldInfo[];
  label: string;
}
