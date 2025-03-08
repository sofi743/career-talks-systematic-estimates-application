package com.example.career.talks.estimates_application.models;

public class NavigationModelNotification extends Notification<NavigationModel> {
    public NavigationModelNotification() {
    }

    public NavigationModelNotification(NavigationModel data, String topic, NotificationState state) {
        super(data, topic, state);
    }
}
