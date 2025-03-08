export class NotificationTopicsUtils {
  static readonly USER_LIST_NOTIFICATION_TOPIC = '/topic/user-list';
  static readonly SUBMITTED_USER_LIST_NOTIFICATION_TOPIC = '/topic/submitted-user-list';
  static readonly RETURNED_SUBMITTED_USER_LIST_NOTIFICATION_TOPIC = '/topic/returned-submitted-user-list';
  static readonly RETURNED_NAVIGATION_NOTIFICATION_TOPIC = '/topic/navigation-notification';
  static readonly LAST_ESTIMATIONS_NOTIFICATION_TOPIC = '/topic/last-estimations';

  //used to send notifications to backend
  static readonly SEND_FULL_NOTIFICATION_TOPIC = '/app/send-full-notification';
  static readonly NAVIGATION_NOTIFICATION_TOPIC = '/app/navigation-notification';
  static readonly NEW_SUBMITTED_USER_LIST_NOTIFICATION_TOPIC = '/app/submitted-user-list';
}
