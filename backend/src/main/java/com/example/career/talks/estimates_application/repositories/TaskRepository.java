package com.example.career.talks.estimates_application.repositories;

import com.example.career.talks.estimates_application.beans.Task;
import com.example.career.talks.estimates_application.utils.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query(value = """
            select * from tasks t where t.mvp_id=:mvpId""", nativeQuery = true)
    List<Task> findTasksByMvpId(Long mvpId);
    List<Task> findTasksByType(TaskType type);
    List<Task> findTaskByMvpIdOrderByTypeAscIdAsc(Long id);
}
