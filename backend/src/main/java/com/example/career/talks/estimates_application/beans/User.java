package com.example.career.talks.estimates_application.beans;

import com.example.career.talks.estimates_application.utils.Role;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import org.hibernate.type.NumericBooleanConverter;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "users")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "callsign")
    private String callsign;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "offline", columnDefinition = "SMALLINT")
    @Convert(converter = NumericBooleanConverter.class)
    private Boolean offline;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "user")
    @OrderBy("id ASC")
    private List<TaskFieldEstimation> taskFieldEstimations;

    public User() {
    }

    public User(Long id, String callsign, Role role, Boolean offline, List<TaskFieldEstimation> taskFieldEstimations) {
        this.id = id;
        this.callsign = callsign;
        this.role = role;
        this.offline = offline;
        this.taskFieldEstimations = taskFieldEstimations;
    }

    public User(String callsign, Role role, Boolean offline) {
        this.callsign = callsign;
        this.role = role;
        this.offline = offline;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean isOffline() {
        return offline;
    }

    public void setOffline(Boolean offline) {
        this.offline = offline;
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
        User user = (User) o;
        return id.equals(user.id) && callsign.equals(user.callsign) && role == user.role &&
                Objects.equals(offline, user.offline) &&
                taskFieldEstimations.equals(user.taskFieldEstimations);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, callsign, role, taskFieldEstimations);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", callsign='" + callsign + '\'' +
                ", role=" + role +
                ", offline=" + offline +
                ", taskFieldEstimations=" + taskFieldEstimations +
                '}';
    }
}
