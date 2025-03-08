package com.example.career.talks.estimates_application.controllers.notification;

import com.example.career.talks.estimates_application.models.NavigationModelNotification;
import com.example.career.talks.estimates_application.models.Notification;
import com.example.career.talks.estimates_application.models.NotificationState;
import com.example.career.talks.estimates_application.services.NotificationService;
import com.example.career.talks.estimates_application.utils.NotificationTopics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * Used to catch notifications from frontend for defined destinations in @MessageMapping Can send notifications back to frontend through NotificationService in topics defined in @SendTo
 */
@Controller
public class NotificationController {
    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private NotificationService notificationService;

    /**
     * Receives message from one instance of frontend from NotificationTopics.SEND_FULL_NOTIFICATION_TOPIC, send back to all clients (all frontend instances) through NotificationTopics.RETURNED_NOTIFICATION_TOPIC
     *
     * @param notification
     * @return
     */
    @MessageMapping(NotificationTopics.SEND_FULL_NOTIFICATION_TOPIC)
    @SendTo(NotificationTopics.RETURNED_NOTIFICATION_TOPIC)
    public Notification sendFullNotification(Notification notification) {
        LOGGER.info("Received full notification: " + notification.getData());
        notificationService.sendFullNotification(notification);
        return notification;
    }

    @MessageMapping(NotificationTopics.NAVIGATION_NOTIFICATION_TOPIC)
    @SendTo(NotificationTopics.RETURNED_NAVIGATION_NOTIFICATION_TOPIC)
    public NavigationModelNotification sendStartEstimationNotification(NavigationModelNotification notification) {
        LOGGER.info("Received full notification: " + notification.getData());
        NavigationModelNotification navigationModelNotification = new NavigationModelNotification(notification.getData(), NotificationTopics.RETURNED_NAVIGATION_NOTIFICATION_TOPIC, NotificationState.FULL);
        return navigationModelNotification;
    }

}
