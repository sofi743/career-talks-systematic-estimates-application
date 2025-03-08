package com.example.career.talks.estimates_application.beans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "task_fields")
public class TaskField implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "key_name")
    private String keyName;

    @ManyToOne
    @JoinColumn(name = "task_id")
    @JsonIgnore
    private Task task;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "taskField")
    @OrderBy("id ASC")
    private List<TaskFieldEstimation> taskFieldEstimations;

    public TaskField() {
    }

    public TaskField(Long id, String keyName, Task task,
                     List<TaskFieldEstimation> taskFieldEstimations) {
        this.id = id;
        this.keyName = keyName;
        this.task = task;
        this.taskFieldEstimations = taskFieldEstimations;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKeyName() {
        return keyName;
    }

    public void setName(String name) {
        this.keyName = name;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public List<TaskFieldEstimation> getTaskFieldEstimations() {
        return taskFieldEstimations;
    }

    public void setTaskFieldEstimations(
            List<TaskFieldEstimation> taskFieldEstimations) {
        this.taskFieldEstimations = taskFieldEstimations;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TaskField taskField = (TaskField) o;
        return id.equals(taskField.id) && keyName.equals(taskField.keyName) &&
                task.equals(taskField.task) && taskFieldEstimations.equals(taskField.taskFieldEstimations);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, keyName, task, taskFieldEstimations);
    }

}
