package com.example.career.talks.estimates_application.repositories;

import com.example.career.talks.estimates_application.beans.TaskFieldEstimation;
import com.example.career.talks.estimates_application.beans.TotalEstimation;
import com.example.career.talks.estimates_application.dto.TaskDetail;
import com.example.career.talks.estimates_application.utils.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskFieldEstimationRepository extends JpaRepository<TaskFieldEstimation, Long> {

    @Query("SELECT new com.example.career.talks.estimates_application.dto.TaskDetail(t.comments, tf.keyName, tfs.best, tfs.likely, tfs.worst, tfs.user.id, u.callsign) " +
            "FROM Task t " +
            "JOIN t.taskFields tf " +
            "JOIN tf.taskFieldEstimations tfs " +
            "JOIN tfs.user u " +
            "WHERE t.id = :taskId " +
            "ORDER BY u.callsign")
    List<TaskDetail> findTasksWithFieldsAndEstimations(@Param("taskId") Long taskId);

    List<TaskFieldEstimation> findTaskFieldEstimationByUserCallsignAndTaskFieldId(String callsign, Long id);

    void deleteAllByTaskFieldIdIn(List<Long> taskFieldIds);
    void deleteAllByIdInBatch(Iterable<Long> ids);

    @Query("SELECT new TotalEstimation(COALESCE(SUM(e.best), 0), COALESCE(SUM(e.likely), 0), COALESCE(SUM(e.worst), 0)) FROM TaskFieldEstimation e JOIN e.user u JOIN e.taskField f JOIN f.task t JOIN t.mvp m WHERE t.type = :taskType AND f.keyName = :keyName AND u.callsign = 'final' AND m.id = :mvpId")
    TotalEstimation calculateSumByTaskTypeAndField(@Param("taskType") TaskType taskType, @Param("keyName") String keyName, @Param("mvpId") Long mvpId);

    @Query("SELECT new TotalEstimation(COALESCE(SUM(e.best), 0), COALESCE(SUM(e.likely), 0), COALESCE(SUM(e.worst), 0)) FROM TaskFieldEstimation e JOIN e.user u JOIN e.taskField f JOIN f.task t JOIN t.mvp m WHERE t.type = :taskType AND u.callsign = 'final' AND m.id = :mvpId")
    TotalEstimation calculateSumByTaskType(@Param("taskType") TaskType taskType, @Param("mvpId") Long mvpId);

}
