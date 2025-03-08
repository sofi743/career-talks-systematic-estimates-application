package com.example.career.talks.estimates_application.dto;

public class TaskDetail {
    private String comments;
    private String keyName;
    private Integer best;
    private Integer likely;
    private Integer worst;
    private Long userId;
    private String callsign;

    public TaskDetail() {
    }

    public TaskDetail(String comments, String keyName, Integer best, Integer likely, Integer worst, Long userId, String callsign) {
        this.comments = comments;
        this.keyName = keyName;
        this.best = best;
        this.likely = likely;
        this.worst = worst;
        this.userId = userId;
        this.callsign = callsign;
    }

    // Getters and Setters
    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getKeyName() {
        return keyName;
    }

    public void setKeyName(String keyName) {
        this.keyName = keyName;
    }

    public Integer getBest() {
        return best;
    }

    public void setBest(Integer best) {
        this.best = best;
    }

    public Integer getLikely() {
        return likely;
    }

    public void setLikely(Integer likely) {
        this.likely = likely;
    }

    public Integer getWorst() {
        return worst;
    }

    public void setWorst(Integer worst) {
        this.worst = worst;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCallsign() {
        return callsign;
    }

    public void setCallsign(String callsign) {
        this.callsign = callsign;
    }
}