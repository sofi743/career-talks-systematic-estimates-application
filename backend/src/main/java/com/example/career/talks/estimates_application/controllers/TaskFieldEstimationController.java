package com.example.career.talks.estimates_application.controllers;

import com.example.career.talks.estimates_application.beans.TaskFieldEstimation;
import com.example.career.talks.estimates_application.dto.TaskDetail;
import com.example.career.talks.estimates_application.dto.UserTaskFieldEstimation;
import com.example.career.talks.estimates_application.services.TaskFieldEstimationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping(value = "/task-estimations")
public class TaskFieldEstimationController {
    @Autowired
    private TaskFieldEstimationService taskFieldEstimationService;

    @GetMapping(value = "/find-all")
    @ResponseBody
    public List<TaskFieldEstimation> findAll() {
        return taskFieldEstimationService.findAll();
    }

    @GetMapping(value = "/find")
    @ResponseBody
    public Optional<TaskFieldEstimation> find(@RequestParam Long id) {
        return taskFieldEstimationService.find(id);
    }

    @PostMapping(value = "/save")
    @ResponseBody
    public TaskFieldEstimation save(@RequestBody TaskFieldEstimation taskFieldEstimation, @RequestParam Long fieldId, @RequestParam Long userId) {
        return taskFieldEstimationService.save(taskFieldEstimation, fieldId, userId);
    }

    @PostMapping(value = "/save-all")
    @ResponseBody
    public void saveAll(@RequestBody List<UserTaskFieldEstimation> userTaskFieldEstimations) {
        taskFieldEstimationService.saveAll(userTaskFieldEstimations);
    }

    @GetMapping(value = "/get-final-estimations")
    @ResponseBody
    public List<TaskFieldEstimation> findTaskFieldEstimationByUserCallsignAndTaskFieldId(@RequestParam String callsign, @RequestParam Long id) {
        return taskFieldEstimationService.findTaskFieldEstimationByUserCallsignAndTaskFieldId(callsign, id);
    }

    @GetMapping(value = "/estimations")
    @ResponseBody
    public List<TaskDetail> getEstimations(@RequestParam Long taskId) {
        return taskFieldEstimationService.getTaskFieldsAndEstimations(taskId);
    }

    @DeleteMapping(value = "/delete-by-taskfield")
    @ResponseBody
    public void deleteByTaskField(@RequestBody List<Long> taskFieldsIds) {
        taskFieldEstimationService.deleteByTaskFieldsIds(taskFieldsIds);
    }
}
