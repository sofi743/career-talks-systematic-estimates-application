package com.example.career.talks.estimates_application.models;

public enum NotificationState {
    /**
     * A FULL NotificationState has a payload containing all current state
     */
    FULL,
    /**
     * A PARTIAL NotificationState has a payload containing all changes since the last update
     */
    PARTIAL
}
