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
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "mvps")
public class Mvp implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "ifd_id")
    @JsonIgnore
    private Ifd ifd;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "mvp")
    @OrderBy("type ASC, id ASC")
    private List<Task> tasks;

    @JoinColumn(name = "total_estimation_id")
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private TotalEstimation totalEstimation;

    public Mvp() {
    }

    public Mvp(Long id, String name, Ifd ifd, List<Task> tasks) {
        this.id = id;
        this.name = name;
        this.ifd = ifd;
        this.tasks = tasks;
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

    public Ifd getIfd() {
        return ifd;
    }

    public void setIfd(Ifd ifd) {
        this.ifd = ifd;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public TotalEstimation getTotalEstimation() {
        return totalEstimation;
    }

    public void setTotalEstimation(TotalEstimation totalEstimation) {
        this.totalEstimation = totalEstimation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Mvp mvp = (Mvp) o;
        return id.equals(mvp.id) && name.equals(mvp.name) && ifd.equals(mvp.ifd) && tasks.equals(mvp.tasks);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, ifd, tasks);
    }

    @Override
    public String toString() {
        return "Mvp{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", ifd=" + ifd +
                ", tasks=" + tasks +
                ", totalEstimation=" + totalEstimation +
                '}';
    }
}
