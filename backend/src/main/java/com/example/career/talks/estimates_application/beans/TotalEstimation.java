package com.example.career.talks.estimates_application.beans;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "total_estimations")
public class TotalEstimation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "best")
    private Long best;

    @Column(name = "likely")
    private Long likely;

    @Column(name = "worst")
    private Long worst;

    @Column(name = "risk_buffer")
    private Long riskBuffer;


    public TotalEstimation() {
    }

    public TotalEstimation(Long id, Long best, Long likely, Long worst, Long riskBuffer) {
        this.id = id;
        this.best = best;
        this.likely = likely;
        this.worst = worst;
        this.riskBuffer = riskBuffer;
    }

    public TotalEstimation(Long best, Long likely, Long worst, Long riskBuffer) {
        this.best = best;
        this.likely = likely;
        this.worst = worst;
        this.riskBuffer = riskBuffer;
    }

    public TotalEstimation(Long best, Long likely, Long worst) {
        this.best = best;
        this.likely = likely;
        this.worst = worst;
    }

    public TotalEstimation(TotalEstimation totalEstimation) {
        this.best = totalEstimation.best;
        this.likely = totalEstimation.likely;
        this.worst = totalEstimation.worst;
        this.riskBuffer = totalEstimation.riskBuffer;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBest() {
        return best;
    }

    public void setBest(Long best) {
        this.best = best;
    }

    public Long getLikely() {
        return likely;
    }

    public void setLikely(Long likely) {
        this.likely = likely;
    }

    public Long getWorst() {
        return worst;
    }

    public void setWorst(Long worst) {
        this.worst = worst;
    }

    public Long getRiskBuffer() {
        return riskBuffer;
    }

    public void setRiskBuffer(Long riskBuffer) {
        this.riskBuffer = riskBuffer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TotalEstimation that = (TotalEstimation) o;
        return Objects.equals(id, that.id) && Objects.equals(best, that.best) &&
                Objects.equals(likely, that.likely) && Objects.equals(worst, that.worst) &&
                Objects.equals(riskBuffer, that.riskBuffer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, best, likely, worst, riskBuffer);
    }

}
