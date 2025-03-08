package com.example.career.talks.estimates_application.controllers;

import com.example.career.talks.estimates_application.beans.User;
import com.example.career.talks.estimates_application.models.SubmittedUser;
import com.example.career.talks.estimates_application.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Controller
@RequestMapping(value = "/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping(value = "/find-all")
    @ResponseBody
    public List<User> findAllUsers() {
        return userService.findAll();
    }

    /**
     * Registers users in database if they are not present. If not, sends the user list to frontend
     *
     * @param joinedUser
     */
    @PostMapping(value = "/register-user")
    @ResponseBody
    public User registerUser(@RequestBody User joinedUser) {
        return userService.save(joinedUser);
    }

    @GetMapping(value = "/get-final-user")
    @ResponseBody
    public User saveOrGetFinalUser() {
        return userService.saveOrGetFinalUser();
    }

    @DeleteMapping(value = "/delete-user")
    @ResponseBody
    public void deleteUser(@RequestParam Long id) {
        userService.deleteUser(id);
    }


    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public class IfdNotFoundException extends RuntimeException {
        public IfdNotFoundException(String message) {
            super(message);
        }
    }


    @PostMapping(value = "/submit-estimation")
    @ResponseBody
    public void submitEstimation(@RequestBody SubmittedUser submittedUser) {
        userService.submitEstimation(submittedUser);
    }

    @DeleteMapping(value = "/empty-submit-estimation")
    @ResponseBody
    public void emptySubmitEstimation() {
        userService.emptySubmitEstimation();
    }
}
