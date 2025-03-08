package com.example.career.talks.estimates_application.controllers;

import com.example.career.talks.estimates_application.beans.Ifd;
import com.example.career.talks.estimates_application.services.IfdService;
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
@RequestMapping(value = "/ifds")
public class IfdController {
    @Autowired
    private IfdService ifdService;

    @GetMapping(value = "/find-all")
    @ResponseBody
    public List<Ifd> findAll() {
        return ifdService.findAll();
    }

    @PostMapping(value = "/save")
    @ResponseBody
    public Ifd save(@RequestBody Ifd ifd) {
        return ifdService.save(ifd);
    }

    @DeleteMapping(value = "/delete")
    @ResponseBody
    public void deleteIfd(@RequestParam Long id) {
        Optional<Ifd> optionalIfd = ifdService.find(id);
        optionalIfd.ifPresent(ifd -> ifdService.delete(ifd));
    }

    @DeleteMapping(value = "/delete-all")
    @ResponseBody
    public void deleteAll() {
        ifdService.deleteAll();
    }

    @GetMapping(value = "/find-one")
    @ResponseBody
    public Optional<Ifd> findOne() {
        return this.ifdService.findOne();
    }
}
