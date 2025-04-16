package com.zenova.back_end.controller;


import com.zenova.back_end.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;


@Controller
public class ChatController {

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessage handleChatMessage(ChatMessage message) {
        // Add timestamp before broadcasting
        message.setTimestamp(LocalDateTime.now().toString());
        return message;
    }
}
