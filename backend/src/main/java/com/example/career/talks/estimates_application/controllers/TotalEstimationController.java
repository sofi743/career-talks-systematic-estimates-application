package com.example.career.talks.estimates_application.controllers;

import com.example.career.talks.estimates_application.beans.Ifd;
import com.example.career.talks.estimates_application.beans.TotalEstimation;
import com.example.career.talks.estimates_application.services.TotalEstimationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping(value = "/total-estimations")
public class TotalEstimationController {

    @Autowired
    private TotalEstimationService totalEstimationService;

    @GetMapping(value = "/find-all")
    @ResponseBody
    public List<TotalEstimation> findAll() {
        return totalEstimationService.findAll();
    }

    @PostMapping(value = "/save-ifd-total")
    @ResponseBody
    public void saveIfdTotal() { totalEstimationService.saveIfdTotal(); }

    @PostMapping(value = "/save-mvp-total")
    @ResponseBody
    public void saveMvpTotal(@RequestParam Long id) {
         totalEstimationService.saveMvpTotal(id);
    }

    @PostMapping(value = "/save-task-total")
    @ResponseBody
    public void saveTaskTotal(@RequestParam Long id) {
        totalEstimationService.saveTaskTotal(id);
    }

    @PutMapping(value = "/update-totals-and-comments")
    @ResponseBody
    public void updateTotalsAndComments(@RequestBody Ifd ifd) {
        totalEstimationService.updateIfdTotals(ifd);
    }
}
