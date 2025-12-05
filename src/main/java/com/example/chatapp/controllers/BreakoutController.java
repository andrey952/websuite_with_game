package com.example.chatapp.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/game2")
public class BreakoutController {

    @GetMapping({"/", ""})
    public String showBreakoutGame() {
        return "game2"; // Представление JSP или Thymeleaf
    }
}