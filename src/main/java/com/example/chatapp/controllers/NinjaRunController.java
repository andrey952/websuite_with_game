package com.example.chatapp.controllers;

import com.example.chatapp.model.NinjaRunScore;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/ninja-run")
public class NinjaRunController {

    @GetMapping({"/", ""})
    public String ninjaRunHome(Model model, HttpSession session) {
        // Аналогично предыдущей игре
        NinjaRunScore score = (NinjaRunScore) session.getAttribute("ninjaRunScore");
        if (score == null) {
            score = new NinjaRunScore();
            session.setAttribute("ninjaRunScore", score);
        }
        model.addAttribute("score", score);
        return "ninja-run";
    }

    // Далее сюда добавляются обработчики игровой логики и формы
}