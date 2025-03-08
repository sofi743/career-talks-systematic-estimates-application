package com.example.career.talks.estimates_application.services;

import com.example.career.talks.estimates_application.beans.Task;
import com.example.career.talks.estimates_application.beans.TaskField;
import com.example.career.talks.estimates_application.repositories.TaskFieldRepository;
import com.example.career.talks.estimates_application.utils.DatabaseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskFieldService {
    @Autowired
    private TaskFieldRepository repository;

    @Autowired
    private TaskService taskService;

    public Optional<TaskField> find(Long id) {
          return repository.findById(id);
      }

    public List<TaskField> findAll() {
        return repository.findAll(Sort.by("id").ascending());
    }

    public void save(TaskField taskField, Long id) {
        Optional<Task> optionalTask = taskService.find(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            taskField.setTask(task);
            DatabaseUtils.linkDatabaseReference(taskField);
            repository.save(taskField);
        }
    }

}
