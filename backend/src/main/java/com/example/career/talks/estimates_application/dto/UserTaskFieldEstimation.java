package com.example.career.talks.estimates_application.dto;

import java.util.List;
import java.util.Objects;

/***
 * This model assign the list of estimations to one user
 */
public class UserTaskFieldEstimation {
    private List<TaskFieldEstimationDto> taskFieldEstimationDtos;
    private Long userId;


    public UserTaskFieldEstimation(List<TaskFieldEstimationDto> taskFieldEstimations, Long userId) {
        this.taskFieldEstimationDtos = taskFieldEstimations;
        this.userId = userId;
    }

    public List<TaskFieldEstimationDto> getTaskFieldEstimationDtos() {
        return taskFieldEstimationDtos;
    }

    public void setTaskFieldEstimationDtos(List<TaskFieldEstimationDto> taskFieldEstimationDtos) {
        this.taskFieldEstimationDtos = taskFieldEstimationDtos;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserTaskFieldEstimation that = (UserTaskFieldEstimation) o;
        return Objects.equals(taskFieldEstimationDtos, that.taskFieldEstimationDtos) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(taskFieldEstimationDtos, userId);
    }


}
