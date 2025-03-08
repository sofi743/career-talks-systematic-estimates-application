package com.example.career.talks.estimates_application.services;

import com.example.career.talks.estimates_application.beans.TaskField;
import com.example.career.talks.estimates_application.beans.TaskFieldEstimation;
import com.example.career.talks.estimates_application.beans.User;
import com.example.career.talks.estimates_application.dto.TaskDetail;
import com.example.career.talks.estimates_application.dto.UserTaskFieldEstimation;
import com.example.career.talks.estimates_application.repositories.TaskFieldEstimationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TaskFieldEstimationService {
    @Autowired
    private TaskFieldEstimationRepository repository;
    @Autowired
    private TaskFieldService taskFieldService;
    @Autowired
    private UserService userService;

    public List<TaskFieldEstimation> findAll() {
        return repository.findAll(Sort.by("id").ascending());
    }

    public TaskFieldEstimation save(TaskFieldEstimation taskFieldEstimation, Long fieldId, Long userId) {
        Optional<TaskField> optionalTaskField = taskFieldService.find(fieldId);
        Optional<User> optionalUser = userService.find(userId);
        if (optionalTaskField.isPresent() && optionalUser.isPresent()) {
            taskFieldEstimation.setUser(optionalUser.get());
            taskFieldEstimation.setTaskField(optionalTaskField.get());
            TaskFieldEstimation savedEstimation = repository.save(taskFieldEstimation);
            return savedEstimation;
        }
        String errorMessage = "Error saving";
        throw new RuntimeException(errorMessage);
    }

    public Optional<TaskFieldEstimation> find(Long id) {
        return repository.findById(id);
    }

    public void saveAll(List<UserTaskFieldEstimation> userTaskFieldEstimations) {
        Collection<TaskFieldEstimation> taskFieldEstimations = new ArrayList<>();
        userTaskFieldEstimations.forEach(userTaskFieldEstimation -> userTaskFieldEstimation.getTaskFieldEstimationDtos()
                .forEach(taskFieldEstimationDto -> {
                    TaskFieldEstimation taskFieldEstimation = new TaskFieldEstimation();
                    taskFieldEstimation.setBest(taskFieldEstimationDto.getBest());
                    taskFieldEstimation.setLikely(taskFieldEstimationDto.getLikely());
                    taskFieldEstimation.setWorst(taskFieldEstimationDto.getWorst());
                    taskFieldEstimation.setComments(taskFieldEstimationDto.getComments());
                    Optional<TaskField> optionalTaskField = taskFieldService.find(taskFieldEstimationDto.getFieldId());
                    Optional<User> optionalUser = userService.find(userTaskFieldEstimation.getUserId());
                    if (optionalTaskField.isPresent() && optionalUser.isPresent()) {
                        taskFieldEstimation.setUser(optionalUser.get());
                        taskFieldEstimation.setTaskField(optionalTaskField.get());
                    }
                    taskFieldEstimations.add(taskFieldEstimation);
                }));

        this.repository.saveAll(taskFieldEstimations);
    }

    public List<TaskDetail> getTaskFieldsAndEstimations(Long taskId) {
        try {
            List<TaskDetail> taskDetails = repository.findTasksWithFieldsAndEstimations(taskId);
            return taskDetails;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public List<TaskFieldEstimation> findTaskFieldEstimationByUserCallsignAndTaskFieldId(String callsign, Long id) {
        return repository.findTaskFieldEstimationByUserCallsignAndTaskFieldId(callsign, id);
    }

    @Transactional
    public void deleteByTaskFieldsIds(List<Long> taskFieldsIds) {
        repository.deleteAllByTaskFieldIdIn(taskFieldsIds);
    }
}
