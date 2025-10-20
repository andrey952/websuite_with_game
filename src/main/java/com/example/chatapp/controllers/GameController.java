package com.example.chatapp.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpSession;
import java.util.Random;

import com.example.chatapp.model.ScoreCounter;

@Controller
@RequestMapping("/game")
public class GameController {

    private final Random random = new Random();

    @GetMapping({"/", ""}) // Главная страница игры
    public String gameHome(Model model, HttpSession session) {
        ScoreCounter score = (ScoreCounter) session.getAttribute("score");
        if(score == null) {
            score = new ScoreCounter();
            session.setAttribute("score", score);
        }
        model.addAttribute("score", score);
        return "game";
    }

    @GetMapping("/play") // Обработка игры
    public String playGame(@RequestParam("choice") String choice, Model model, HttpSession session) {
        int computerChoiceInt = random.nextInt(3);
        String computerChoice = "";
        switch(computerChoiceInt){
            case 0: computerChoice="rock"; break;
            case 1: computerChoice="paper"; break;
            case 2: computerChoice="scissors"; break;
        }

        String result = determineWinner(choice, computerChoice);

        ScoreCounter score = (ScoreCounter) session.getAttribute("score");
        if(result.contains("You win!")) {
            score.setWins(score.getWins() + 1L); // Увеличить количество побед
        } else if(result.contains("It's a tie!")) {
            score.setTies(score.getTies() + 1L); // Увеличить количество ничьих
        } else {
            score.setLosses(score.getLosses() + 1L); // Увеличить количество поражений
        }

        session.setAttribute("score", score);

        model.addAttribute("playerChoice", choice);
        model.addAttribute("computerChoice", computerChoice);
        model.addAttribute("result", result);
        model.addAttribute("score", score);
        return "game";
    }

    private String determineWinner(String playerChoice, String computerChoice) {
        if(playerChoice.equals(computerChoice)) return "It's a tie!";

        if ((playerChoice.equals("rock") && computerChoice.equals("scissors")) ||
                (playerChoice.equals("paper") && computerChoice.equals("rock")) ||
                (playerChoice.equals("scissors") && computerChoice.equals("paper"))) {
            return "You win!";
        } else {
            return "Computer wins!";
        }
    }

    @PostMapping("/reset")
    public String resetScore(HttpSession session) {
        // Создаем новый счётчик очков
        ScoreCounter score = new ScoreCounter();
        session.setAttribute("score", score);
        return "redirect:/game/";
    }
}