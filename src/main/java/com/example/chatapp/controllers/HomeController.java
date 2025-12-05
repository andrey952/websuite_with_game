package com.example.chatapp.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/start-game")
    public String startGame() {
        return "redirect:/game/";
    }
}