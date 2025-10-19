package com.example.chatapp.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.Random;

@Controller
@RequestMapping("/game")
public class GameController {

    Random random = new Random();

    @GetMapping({"/", ""}) // Главная страница игры
    public String gameHome() {
        return "game"; // render game template
    }

    @GetMapping("/play") // Обработка игры
    public ModelAndView playGame(@RequestParam("choice") String choice) {
        int computerChoiceInt = random.nextInt(3);

        String computerChoice = "";
        switch(computerChoiceInt){
            case 0: computerChoice="rock"; break;
            case 1: computerChoice="paper"; break;
            case 2: computerChoice="scissors"; break;
        }

        String result = determineWinner(choice, computerChoice);

        ModelAndView mav = new ModelAndView("game");
        mav.addObject("playerChoice", choice);
        mav.addObject("computerChoice", computerChoice);
        mav.addObject("result", result);
        return mav;
    }

    private String determineWinner(String playerChoice, String computerChoice) {
        if(playerChoice.equals(computerChoice)) return "It's a tie!";

        if((playerChoice.equals("rock") && computerChoice.equals("scissors")) ||
                (playerChoice.equals("paper") && computerChoice.equals("rock")) ||
                (playerChoice.equals("scissors") && computerChoice.equals("paper"))) {
            return "You win!";
        } else {
            return "Computer wins!";
        }
    }
}