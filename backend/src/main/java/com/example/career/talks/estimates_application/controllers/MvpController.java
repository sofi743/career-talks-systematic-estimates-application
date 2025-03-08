package com.example.career.talks.estimates_application.controllers;

import com.example.career.talks.estimates_application.beans.Mvp;
import com.example.career.talks.estimates_application.services.MvpService;
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
@RequestMapping(value = "/mvps")
public class MvpController {
    @Autowired
    private MvpService mvpService;

    @GetMapping(value = "/find-all")
    @ResponseBody
    public List<Mvp> findAll() {
        return mvpService.findAll();
    }

    @GetMapping(value = "/find")
    @ResponseBody
    public Optional<Mvp> find(@RequestParam Long id) {
        return mvpService.find(id);
    }

    @PostMapping(value = "/save")
    @ResponseBody
    public Mvp save(@RequestBody Mvp mvp) {
        return mvpService.save(mvp);
    }

    @DeleteMapping(value = "/delete")
    @ResponseBody
    public void delete(@RequestParam Long id) {
        mvpService.delete(id);
    }

    @PutMapping(value = "/update")
    @ResponseBody
    public Mvp update(@RequestBody Mvp updatedMvp, @RequestParam Long id) {
        return this.mvpService.updateName(updatedMvp.getName(), id);
    }

}
