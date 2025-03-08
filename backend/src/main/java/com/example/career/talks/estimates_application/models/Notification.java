package com.example.career.talks.estimates_application.models;

import java.io.Serializable;
import java.util.Objects;

public class Notification<T> implements Serializable {
    private T data;
    private String topic;
    private NotificationState state;

    public Notification() {
    }

    public Notification(T data, String topic, NotificationState state) {
        this.data = data;
        this.topic = topic;
        this.state = state;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public NotificationState getState() {
        return state;
    }

    public void setState(NotificationState state) {
        this.state = state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Notification that = (Notification) o;
        return data.equals(that.data) && topic.equals(that.topic) && state == that.state;
    }

    @Override
    public int hashCode() {
        return Objects.hash(data, topic, state);
    }

    @Override
    public String toString() {
        return "Notification{" +
                "data='" + data + '\'' +
                ", topic='" + topic + '\'' +
                ", state=" + state +
                '}';
    }
}
