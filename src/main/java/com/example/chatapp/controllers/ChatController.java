package com.example.chatapp.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Component;

@Component
public class ChatController {

    @MessageMapping("/sendMessage")
    @SendTo("/topic/public")
    public String handleMessage(String message) {
        return message; // Просто возвращаем сообщение обратно всем подписчикам
    }
}