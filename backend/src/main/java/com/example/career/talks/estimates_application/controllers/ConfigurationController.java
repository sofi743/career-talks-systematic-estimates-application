package com.example.career.talks.estimates_application.controllers;

import com.example.career.talks.estimates_application.services.ConfigurationService;
import com.example.career.talks.estimates_application.beans.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping(value = "/configuration")
public class ConfigurationController {
    @Autowired
    private ConfigurationService configurationService;

    @GetMapping(value = "/find-all")
    @ResponseBody
    public List<Configuration> findAll() {
        return configurationService.findAll();
    }

    /* Saves or updates the new configuration */
    @PostMapping(value = "/save")
    @ResponseBody
    public Configuration save(@RequestBody Configuration configuration, @RequestParam Long id) {
       return configurationService.save(configuration, id);
    }
}
