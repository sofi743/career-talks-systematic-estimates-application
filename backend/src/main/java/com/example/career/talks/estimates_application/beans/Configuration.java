package com.example.career.talks.estimates_application.beans;

import com.example.career.talks.estimates_application.utils.EstimationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "configurations")
public class Configuration implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "estimation_type")
    private EstimationType estimationType;

    @Column(name = "complexity")
    private int complexity;

    @OneToOne
    @JoinColumn(name = "ifd_id")
    @JsonIgnore
    private Ifd ifd;

    public Configuration() {
    }

    public Configuration(Long id, EstimationType estimationType, int complexity, Ifd ifd) {
        this.id = id;
        this.estimationType = estimationType;
        this.complexity = complexity;
        this.ifd = ifd;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EstimationType getEstimationType() {
        return estimationType;
    }

    public void setEstimationType(EstimationType estimationType) {
        this.estimationType = estimationType;
    }

    public int getComplexity() {
        return complexity;
    }

    public void setComplexity(int complexity) {
        this.complexity = complexity;
    }

    public Ifd getIfd() {
        return ifd;
    }

    public void setIfd(Ifd ifd) {
        this.ifd = ifd;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Configuration that = (Configuration) o;
        return complexity == that.complexity && id.equals(that.id) && estimationType == that.estimationType &&
                ifd.equals(that.ifd);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, estimationType, complexity, ifd);
    }

}
