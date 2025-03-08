package com.example.career.talks.estimates_application.utils;

public class NotificationTopics {
    public static final String FULL_NOTIFICATION_TOPIC = "/topic/full-notification";
    public static final String PARTIAL_NOTIFICATION_TOPIC = "/topic/partial-notification";
    public static final String RETURNED_NOTIFICATION_TOPIC = "/topic/returned-notification";
    public static final String USER_LIST_NOTIFICATION_TOPIC = "/topic/user-list";
    public static final String LAST_ESTIMATIONS_NOTIFICATION_TOPIC = "/topic/last-estimations";
    public static final String SUBMITTED_USER_LIST_NOTIFICATION_TOPIC = "/topic/submitted-user-list";
    public static final String RETURNED_SUBMITTED_USER_LIST_NOTIFICATION_TOPIC = "/topic/returned-submitted-user-list";
    public static final String RETURNED_NAVIGATION_NOTIFICATION_TOPIC = "/topic/navigation-notification";


    //used to receive data from frontend
    public static final String SEND_FULL_NOTIFICATION_TOPIC = "/send-full-notification";
    public static final String NEW_SUBMITTED_USER_LIST_NOTIFICATION_TOPIC = "/submitted-user-list";
    public static final String NAVIGATION_NOTIFICATION_TOPIC = "/navigation-notification";

    private NotificationTopics() {
    }


}
