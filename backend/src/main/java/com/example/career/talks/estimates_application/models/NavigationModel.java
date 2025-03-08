package com.example.career.talks.estimates_application.models;

import java.util.Objects;

public class NavigationModel {
    private NavigationActionsEnum navigationActions;
    private Long mvpId;
    private Long taskId;
    private Boolean reestimation;

    public NavigationModel(NavigationActionsEnum navigationActions, Long mvpId, Long taskId, Boolean reestimation) {
        this.navigationActions = navigationActions;
        this.mvpId = mvpId;
        this.taskId = taskId;
        this.reestimation = reestimation;
    }

    public NavigationActionsEnum getNavigationActions() {
        return navigationActions;
    }

    public void setNavigationActions(NavigationActionsEnum navigationActions) {
        this.navigationActions = navigationActions;
    }

    public Long getMvpId() {
        return mvpId;
    }

    public void setMvpId(Long mvpId) {
        this.mvpId = mvpId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Boolean getReestimation() {
        return reestimation;
    }

    public void setReestimation(Boolean reestimation) {
        this.reestimation = reestimation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        NavigationModel that = (NavigationModel) o;
        return navigationActions == that.navigationActions && Objects.equals(mvpId, that.mvpId) && Objects.equals(taskId, that.taskId) && Objects.equals(reestimation, that.reestimation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(navigationActions, mvpId, taskId, reestimation);
    }

    @Override
    public String toString() {
        return "NavigationModel{" +
                "navigationActions=" + navigationActions +
                ", mvpId=" + mvpId +
                ", taskId=" + taskId +
                ", reestimation=" + reestimation +
                '}';
    }
}
