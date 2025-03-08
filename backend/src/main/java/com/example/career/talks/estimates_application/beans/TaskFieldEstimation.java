package com.example.career.talks.estimates_application.beans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "task_field_est")
public class TaskFieldEstimation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "best")
    private int best;

    @Column(name = "likely")
    private int likely;

    @Column(name = "worst")
    private int worst;

    @Column(name = "comments")
    private String comments;

    @ManyToOne
    @JoinColumn(name = "field_id")
    @JsonIgnore
    private TaskField taskField;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public TaskFieldEstimation() {
    }

    public TaskFieldEstimation(Long id, int best, int likely, int worst, String comments, TaskField taskField,
                               User user) {
        this.id = id;
        this.best = best;
        this.likely = likely;
        this.worst = worst;
        this.comments = comments;
        this.taskField = taskField;
        this.user = user;
    }

    public TaskFieldEstimation(int best, int likely, int worst, TaskField taskField, User user) {
        this.best = best;
        this.likely = likely;
        this.worst = worst;
        this.taskField = taskField;
        this.user = user;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getBest() {
        return best;
    }

    public void setBest(int best) {
        this.best = best;
    }

    public int getLikely() {
        return likely;
    }

    public void setLikely(int likely) {
        this.likely = likely;
    }

    public int getWorst() {
        return worst;
    }

    public void setWorst(int worst) {
        this.worst = worst;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }


    public TaskField getTaskField() {
        return taskField;
    }

    public void setTaskField(TaskField taskField) {
        this.taskField = taskField;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TaskFieldEstimation that = (TaskFieldEstimation) o;
        return best == that.best && likely == that.likely && worst == that.worst && comments == that.comments &&
                id.equals(that.id) && taskField.equals(that.taskField) && user.equals(that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, best, likely, worst, comments, taskField, user);
    }

}
