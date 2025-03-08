package com.example.career.talks.estimates_application.beans;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "ifd")
public class Ifd implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "ifd")
    @OrderBy("id ASC")
    private List<Mvp> mvps;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "ifd")
    private Configuration configuration;

    @JoinColumn(name = "total_estimation_id")
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private TotalEstimation totalEstimation;


    public Ifd() {
    }

    public Ifd(Long id, List<Mvp> mvps,
               Configuration configuration) {
        this.id = id;
        this.mvps = mvps;
        this.configuration = configuration;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public List<Mvp> getMvps() {
        return mvps;
    }

    public void setMvps(List<Mvp> mvps) {
        this.mvps = mvps;
    }

    public Configuration getConfiguration() {
        return configuration;
    }

    public void setConfiguration(Configuration configuration) {
        this.configuration = configuration;
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
        Ifd ifd = (Ifd) o;
        return id.equals(ifd.id) && mvps.equals(ifd.mvps) && configuration.equals(ifd.configuration);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, mvps, configuration);
    }

}
