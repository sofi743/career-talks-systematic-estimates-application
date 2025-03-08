package com.example.career.talks.estimates_application.services;

import com.example.career.talks.estimates_application.beans.User;
import com.example.career.talks.estimates_application.models.JoinedUsersListNotification;
import com.example.career.talks.estimates_application.models.NotificationState;
import com.example.career.talks.estimates_application.models.SubmittedUser;
import com.example.career.talks.estimates_application.models.SubmittedUsersListNotification;
import com.example.career.talks.estimates_application.repositories.UserRepository;
import com.example.career.talks.estimates_application.utils.NotificationTopics;
import com.example.career.talks.estimates_application.utils.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class UserService {

    //this list needs to be concurrent;
    private final List<User> users = new CopyOnWriteArrayList<>();
    private final Set<SubmittedUser> submittedUsers = Collections.synchronizedSet(new HashSet<>());
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);


    @Autowired
    private UserRepository repository;

    @Autowired
    private NotificationService notificationService;

    public List<User> findAll() {
        return repository.findAll(Sort.by("id").ascending());
    }

    /**
     * Returns user found if the user already exists in database and notifies frontend. If not, saves and returns the new user
     *
     * @param user
     * @return
     */
    public User save(User user) {
        Optional<User> optionalUser = repository.findUserByCallsign(user.getCallsign());
        if (optionalUser.isPresent()) {
            this.notifyUsers();
            return optionalUser.get();
        } else {
            return this.saveNewUser(user);
        }
    }

    /**
     * Returns the user after saving it to database and to concurrent list, and notifying frontend with the updated list
     *
     * @param user - new user to be introduced
     * @return
     */
    private User saveNewUser(User user) {
        repository.save(user);
        this.addUser(user);
        this.notifyUsers();
        return user;
    }


    public User saveOrGetFinalUser() {
        Optional<User> optionalUser = repository.findUserByCallsign("final");
        return optionalUser.orElseGet(() -> repository.save(new User("final", Role.PARTICIPANT, false)));
    }

    public Optional<User> find(Long id) {
        return repository.findById(id);
    }

    private void addUser(User joinedUser) {
        if (!users.contains(joinedUser)) {
            users.add(joinedUser);
        }
        notifyUsers();
    }

    private void removeUser(String callsign) {
        users.removeIf(u -> u.getCallsign().equals(callsign));
        notifyUsers();
    }

    private void notifyUsers() {
        JoinedUsersListNotification notification = new JoinedUsersListNotification();
        notification.setTopic(NotificationTopics.USER_LIST_NOTIFICATION_TOPIC);
        notification.setState(NotificationState.FULL);
        notification.setData(users); // Send the full list of users
        notificationService.sendUserList(notification);
    }

    public void deleteUser(Long id) {
        Optional<User> optionalUser = repository.findById(id);
        optionalUser.ifPresent((existentUser) -> {
            repository.delete(existentUser);
            this.removeUser(existentUser.getCallsign());
        });
    }

    @Transactional
    public void submitEstimation(SubmittedUser submittedUser) {
        synchronized (this) {
            System.out.println(submittedUser.getCallsign());
            submittedUsers.add(submittedUser);
            LOGGER.error("After add to set: " + submittedUsers);
            notifySubmittedUsers();
        }
    }

    private synchronized void notifySubmittedUsers() {
        SubmittedUsersListNotification notification = new SubmittedUsersListNotification();
        notification.setTopic(NotificationTopics.SUBMITTED_USER_LIST_NOTIFICATION_TOPIC);
        notification.setState(NotificationState.FULL);
        notification.setData(submittedUsers);
        LOGGER.error("Notification: " + submittedUsers);
        notificationService.sendSubmittedUserList(notification);
    }

    public synchronized void emptySubmitEstimation() {
        submittedUsers.clear();
        notifySubmittedUsers();
    }
}
