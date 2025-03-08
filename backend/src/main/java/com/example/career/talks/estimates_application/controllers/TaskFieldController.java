package com.example.career.talks.estimates_application.controllers;

import com.example.career.talks.estimates_application.beans.TaskField;
import com.example.career.talks.estimates_application.services.TaskFieldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping(value = "/task-fields")
public class TaskFieldController {
    @Autowired
    private TaskFieldService taskFieldService;

    @GetMapping(value = "/find-all")
    @ResponseBody
    public List<TaskField> findAll() {
        return taskFieldService.findAll();
    }

    @GetMapping(value = "/find")
    @ResponseBody
    public Optional<TaskField> find(@RequestParam Long id) {
        return taskFieldService.find(id);
    }

    @PostMapping(value = "/save")
    @ResponseBody
    public void save(@RequestBody TaskField taskField, @RequestParam Long id) {
        taskFieldService.save(taskField, id);
    }

}
