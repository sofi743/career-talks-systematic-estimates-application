package com.example.career.talks.estimates_application.services;

import com.example.career.talks.estimates_application.beans.Ifd;
import com.example.career.talks.estimates_application.models.JoinedUsersListNotification;
import com.example.career.talks.estimates_application.models.NavigationModelNotification;
import com.example.career.talks.estimates_application.models.Notification;
import com.example.career.talks.estimates_application.models.SubmittedUsersListNotification;
import com.example.career.talks.estimates_application.utils.NotificationTopics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Used to send backend notifications to frontend
 */
@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendFullNotification(Notification notification) {
        messagingTemplate.convertAndSend(NotificationTopics.FULL_NOTIFICATION_TOPIC, notification);
    }

    public void sendPartialNotification(Notification notification) {
        messagingTemplate.convertAndSend(NotificationTopics.PARTIAL_NOTIFICATION_TOPIC, notification);
    }

    public void sendUserList(JoinedUsersListNotification joinedUsersListNotification) {
        messagingTemplate.convertAndSend(NotificationTopics.USER_LIST_NOTIFICATION_TOPIC, joinedUsersListNotification);
    }

    public void sendLastEstimationsNotification(Notification<Ifd> ifdNotification) {
        messagingTemplate.convertAndSend(NotificationTopics.LAST_ESTIMATIONS_NOTIFICATION_TOPIC, ifdNotification);
    }

    public synchronized void sendSubmittedUserList(SubmittedUsersListNotification submittedUsersListNotification) {
        messagingTemplate.convertAndSend(NotificationTopics.SUBMITTED_USER_LIST_NOTIFICATION_TOPIC,
                submittedUsersListNotification);
    }

    public void sendNavigationModel(NavigationModelNotification navigationModelNotification) {
        messagingTemplate.convertAndSend(NotificationTopics.RETURNED_NAVIGATION_NOTIFICATION_TOPIC,
                navigationModelNotification);
    }
}
