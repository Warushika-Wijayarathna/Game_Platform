package com.zenova.back_end.controller;

import com.zenova.back_end.service.GameService;
import com.zenova.back_end.util.JwtUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/game")
public class GameController {
    private final GameService gameService;
    private final JwtUtil jwtUtil;

    public GameController(GameService gameService, JwtUtil jwtUtil) {
        this.gameService = gameService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(value = "/add")
    // request body includes the user token check for priviledges before give access if only admin can add games

}
