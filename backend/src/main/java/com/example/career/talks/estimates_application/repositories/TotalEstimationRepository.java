package com.example.career.talks.estimates_application.repositories;

import com.example.career.talks.estimates_application.beans.TotalEstimation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TotalEstimationRepository extends JpaRepository<TotalEstimation, Long> {

    @Query("SELECT new TotalEstimation(" +
           "COALESCE(SUM(tfe.best), 0), " +
           "COALESCE(SUM(tfe.likely), 0), " +
           "COALESCE(SUM(tfe.worst), 0), " +
           "(COALESCE(SUM(tfe.best), 0) + 4 * COALESCE(SUM(tfe.likely), 0) + COALESCE(SUM(tfe.worst), 0)) / 6 + " +
           "2 * (COALESCE(SUM(tfe.worst), 0) - COALESCE(SUM(tfe.best), 0)) / 6) " +
           "FROM Ifd i " +
           "JOIN i.mvps m " +
           "JOIN m.tasks t " +
           "JOIN t.taskFields tf " +
           "JOIN tf.taskFieldEstimations tfe " +
           "JOIN tfe.user u "+
           "WHERE i.id = :id and u.callsign='final'")
    TotalEstimation sumIfdTotals(Long id);

    @Query("SELECT new TotalEstimation(" +
           "COALESCE(SUM(tfe.best), 0), " +
           "COALESCE(SUM(tfe.likely), 0), " +
           "COALESCE(SUM(tfe.worst), 0), " +
           "(COALESCE(SUM(tfe.best), 0) + 4 * COALESCE(SUM(tfe.likely), 0) + COALESCE(SUM(tfe.worst), 0)) / 6 + " +
           "2 * (COALESCE(SUM(tfe.worst), 0) - COALESCE(SUM(tfe.best), 0)) / 6) " +
           "FROM Mvp m " +
           "JOIN m.tasks t " +
           "JOIN t.taskFields tf " +
           "JOIN tf.taskFieldEstimations tfe " +
           "JOIN tfe.user u "+
           "WHERE m.id = :id and u.callsign='final'")
    TotalEstimation sumMvpTotals(Long id);

    @Query("SELECT new TotalEstimation(" +
           "COALESCE(SUM(tfe.best), 0), " +
           "COALESCE(SUM(tfe.likely), 0), " +
           "COALESCE(SUM(tfe.worst), 0), " +
           "(COALESCE(SUM(tfe.best), 0) + 4 * COALESCE(SUM(tfe.likely), 0) + COALESCE(SUM(tfe.worst), 0)) / 6 + " +
           "2 * (COALESCE(SUM(tfe.worst), 0) - COALESCE(SUM(tfe.best), 0)) / 6) " +
           "FROM Task t " +
           "JOIN t.taskFields tf " +
           "JOIN tf.taskFieldEstimations tfe " +
           "JOIN tfe.user u "+
           "WHERE t.id = :id and u.callsign='final'")
    TotalEstimation sumTaskTotals(Long id);
}
