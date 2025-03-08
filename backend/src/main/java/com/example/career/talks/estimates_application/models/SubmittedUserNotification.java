package com.example.career.talks.estimates_application.models;

public class SubmittedUserNotification extends Notification<SubmittedUser> {
    public SubmittedUserNotification() {
    }

    public SubmittedUserNotification(SubmittedUser data, String topic, NotificationState state) {
        super(data, topic, state);
    }
}
