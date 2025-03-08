package com.example.career.talks.estimates_application.beans;

import com.example.career.talks.estimates_application.utils.TaskType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import org.hibernate.type.NumericBooleanConverter;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "tasks")
public class Task implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "task_type")
    private TaskType type;

    @Column(name = "comments")
    private String comments;

    @Column(name = "estimated", columnDefinition = "SMALLINT")
    @Convert(converter = NumericBooleanConverter.class)
    private Boolean estimated = false;

    @ManyToOne
    @JoinColumn(name = "mvp_id")
    @JsonIgnore
    private Mvp mvp;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "task")
    @OrderBy("id ASC")
    private List<TaskField> taskFields;

    @JoinColumn(name = "total_estimation_id")
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private TotalEstimation totalEstimation;

    public Task() {
    }

    public Task(Long id, String name, TaskType type, String comments, Boolean estimated, Mvp mvp, List<TaskField> taskFields, TotalEstimation totalEstimation) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.comments = comments;
        this.estimated = estimated;
        this.mvp = mvp;
        this.taskFields = taskFields;
        this.totalEstimation = totalEstimation;
    }

    public Task(Long id, String name, TaskType type, String comments, Mvp mvp,
                List<TaskField> taskFields, TotalEstimation totalEstimation) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.comments = comments;
        this.mvp = mvp;
        this.taskFields = taskFields;
        this.totalEstimation = totalEstimation;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TaskType getType() {
        return type;
    }

    public void setType(TaskType type) {
        this.type = type;
    }

    public Mvp getMvp() {
        return mvp;
    }

    public void setMvp(Mvp mvp) {
        this.mvp = mvp;
    }

    public List<TaskField> getTaskFields() {
        return taskFields;
    }

    public void setTaskFields(List<TaskField> taskFields) {
        this.taskFields = taskFields;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public TotalEstimation getTotalEstimation() {
        return totalEstimation;
    }

    public void setTotalEstimation(TotalEstimation totalEstimation) {
        this.totalEstimation = totalEstimation;
    }

    public Boolean getEstimated() {
        return estimated;
    }

    public void setEstimated(Boolean estimated) {
        this.estimated = estimated;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Task task = (Task) o;
        return estimated == task.estimated && Objects.equals(id, task.id) && Objects.equals(name, task.name) && type == task.type && Objects.equals(comments, task.comments) && Objects.equals(mvp, task.mvp) && Objects.equals(taskFields, task.taskFields) && Objects.equals(totalEstimation, task.totalEstimation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, type, comments, estimated, mvp, taskFields, totalEstimation);
    }
}
