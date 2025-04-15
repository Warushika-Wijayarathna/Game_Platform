package com.zenova.back_end.controller;

import com.zenova.back_end.dto.*;
import com.zenova.back_end.service.ScoreService;
import com.zenova.back_end.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/play")
public class PlayController {

    @Autowired
    private ScoreService scoreService;

    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping("/game")
    public ResponseEntity<PlayResponseDTO> playGame(@RequestHeader("Authorization") String token, @RequestBody PlayRequestDTO playRequestDTO) {

        token = token.replace("Bearer ", "");

        String userEmail = jwtUtil.getUsernameFromToken(token);
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new PlayResponseDTO("Invalid token", -1));
        }

        ScoreDTO score = new ScoreDTO();
        score.setGame(new GameDTO(playRequestDTO.getGameId()));
        score.setUser(new UserDTO(userEmail));
        score.setScore(playRequestDTO.getScoreValue());

        ScoreDTO savedScore = scoreService.addScore(score);

        return ResponseEntity.ok(new PlayResponseDTO("Score recorded and leaderboard updated", 0));
    }
}
