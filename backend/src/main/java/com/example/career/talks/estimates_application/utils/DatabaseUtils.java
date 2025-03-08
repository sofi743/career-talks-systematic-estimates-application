package com.example.career.talks.estimates_application.utils;

import com.example.career.talks.estimates_application.beans.Ifd;
import com.example.career.talks.estimates_application.beans.Mvp;
import com.example.career.talks.estimates_application.beans.Task;
import com.example.career.talks.estimates_application.beans.TaskField;
import com.example.career.talks.estimates_application.beans.TaskFieldEstimation;
import com.example.career.talks.estimates_application.beans.User;

public class DatabaseUtils {
    public static void linkDatabaseReference(Ifd ifd) {
        if (ifd != null) {
            if (ifd.getConfiguration() != null) {
                ifd.getConfiguration().setIfd(ifd);
            }
            if (ifd.getMvps() != null) {
                for (Mvp mvp : ifd.getMvps()) {
                    mvp.setIfd(ifd);
                    DatabaseUtils.linkDatabaseReference(mvp);
                }
            }
        }
    }

    public static void linkDatabaseReference(Mvp mvp) {
        if (mvp != null) {
            if (mvp.getTasks() != null) {
                for (Task task : mvp.getTasks()) {
                    task.setMvp(mvp);
                    DatabaseUtils.linkDatabaseReference(task);
                }
            }
        }
    }

    public static void linkDatabaseReference(Task task) {
        if (task != null) {
            if (task.getTaskFields() != null) {
                for (TaskField taskField : task.getTaskFields()) {
                    taskField.setTask(task);
                    DatabaseUtils.linkDatabaseReference(taskField);
                }
            }
        }
    }

    public static void linkDatabaseReference(TaskField taskField) {
        if (taskField != null) {
            if (taskField.getTaskFieldEstimations() != null) {
                for (TaskFieldEstimation taskFieldEstimation : taskField.getTaskFieldEstimations()) {
                    taskFieldEstimation.setTaskField(taskField);
                }
            }
        }
    }

    public static void linkDatabaseReference(User user) {
        if (user != null) {
            if (user.getTaskFieldEstimations() != null) {
                for (TaskFieldEstimation taskFieldEstimation: user.getTaskFieldEstimations()) {
                    taskFieldEstimation.setUser(user);
                }
            }
        }
    }

}
