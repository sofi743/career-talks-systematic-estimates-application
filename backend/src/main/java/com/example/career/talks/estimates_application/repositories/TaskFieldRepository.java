package com.example.career.talks.estimates_application.repositories;

import com.example.career.talks.estimates_application.beans.TaskField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskFieldRepository extends JpaRepository<TaskField, Long> {
}
