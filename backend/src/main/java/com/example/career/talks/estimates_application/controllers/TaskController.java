package com.example.career.talks.estimates_application.controllers;

import com.example.career.talks.estimates_application.beans.Mvp;
import com.example.career.talks.estimates_application.beans.Task;
import com.example.career.talks.estimates_application.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping(value = "/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping(value = "/find-all")
    @ResponseBody
    public List<Task> findAll() {
        return taskService.findAll();
    }

    @GetMapping(value = "/find")
    @ResponseBody
    public Optional<Task> find(@RequestParam Long id) {
        return taskService.find(id);
    }

    @GetMapping(value = "/find-parent-mvp")
    @ResponseBody
    public Mvp getParentMvp(@RequestParam Long id) {
        return taskService.getParentMvp(id);
    }

    @PostMapping(value = "/save")
    @ResponseBody
    public Task save(@RequestBody Task task, @RequestParam Long id) {
        return taskService.save(task, id);
    }

    @DeleteMapping(value = "/delete")
    @ResponseBody
    public void delete(@RequestParam Long id) {
        taskService.delete(id);
    }

    @PutMapping(value = "/update")
    @ResponseBody
    public Task update(@RequestBody Task updatedTask, @RequestParam Long id) {
        return this.taskService.update(updatedTask, id);
    }

    @GetMapping(value = "/find-by-mvp")
    @ResponseBody
    public List<Task> getTasksByMvpId(@RequestParam Long mvpId) {
        return taskService.findTasksByMvpId(mvpId);
    }

    @PutMapping(value = "/update-comments")
    @ResponseBody
    public void updateComments(@RequestBody Task task) {
        taskService.updateTaskComments(task);
    }
}
