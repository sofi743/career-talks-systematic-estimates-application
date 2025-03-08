import {Task} from "./task.model";

export interface CurrentInfoModel {
  ifdNumber: string;
  mvpId: number;
  mvpName: string;
  task: Task
}
