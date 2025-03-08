import { NavigationActionsEnum } from './navigation-actions.enum';

export interface NavigationModel {
  navigationActions: NavigationActionsEnum;
  mvpId?: number;
  taskId?: number;
  reestimation?: boolean;
}
