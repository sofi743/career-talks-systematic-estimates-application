import { NotificationState } from './notification-state';

export interface Notification<T> {
  data: T;
  topic: string;
  state: NotificationState;
}
