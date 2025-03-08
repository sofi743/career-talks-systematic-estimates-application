package com.example.career.talks.estimates_application.models;

import java.util.Objects;

public class SubmittedUser {
    private Long id;
    private String callsign;

    public SubmittedUser(Long id, String callsign) {
        this.id = id;
        this.callsign = callsign;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCallsign() {
        return callsign;
    }

    public void setCallsign(String callsign) {
        this.callsign = callsign;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SubmittedUser that = (SubmittedUser) o;
        return Objects.equals(id, that.id) && Objects.equals(callsign, that.callsign);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, callsign);
    }

    @Override
    public String toString() {
        return "SubmittedUser{" +
                "id=" + id +
                ", callsign='" + callsign + '\'' +
                '}';
    }
}
