package com.example.career.talks.estimates_application.models;

import java.util.Set;

public class SubmittedUsersListNotification extends Notification<Set<SubmittedUser>> {
    public SubmittedUsersListNotification() {
    }

    public SubmittedUsersListNotification(Set<SubmittedUser> data, String topic, NotificationState state) {
        super(data, topic, state);
    }
}
