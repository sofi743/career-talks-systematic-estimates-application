package com.example.career.talks.estimates_application.models;

import com.example.career.talks.estimates_application.beans.User;

import java.util.List;

public class JoinedUsersListNotification extends Notification<List<User>> {
    public JoinedUsersListNotification() {
    }

    public JoinedUsersListNotification(List<User> data, String topic, NotificationState state) {
        super(data, topic, state);
    }
}
