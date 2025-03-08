package com.example.career.talks.estimates_application.dto;

import java.util.Objects;

/***
 * This model extends TaskFieldEstimation bean, extracting only fieldId from TaskField
 */
public class TaskFieldEstimationDto {
     private Long id;
     private int best;
     private int likely;
     private int worst;
     private String comments;
     private Long fieldId;

    public TaskFieldEstimationDto(Long id, int best, int likely, int worst, String comments, Long fieldId) {
        this.id = id;
        this.best = best;
        this.likely = likely;
        this.worst = worst;
        this.comments = comments;
        this.fieldId = fieldId;
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

    public Long getFieldId() {
        return fieldId;
    }

    public void setFieldId(Long fieldId) {
        this.fieldId = fieldId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TaskFieldEstimationDto that = (TaskFieldEstimationDto) o;
        return best == that.best && likely == that.likely && worst == that.worst && Objects.equals(id, that.id) &&
                Objects.equals(comments, that.comments) && Objects.equals(fieldId, that.fieldId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, best, likely, worst, comments, fieldId);
    }

}
