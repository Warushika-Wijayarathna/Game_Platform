package com.zenova.back_end.controller;

import com.zenova.back_end.dto.LeaderBoardDTO;
import com.zenova.back_end.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/leaderboard")
public class LeaderBoardController {
    @Autowired
    private ScoreService scoreService;

    @GetMapping("/top")
    public ResponseEntity<List<LeaderBoardDTO>> getTopLeaderBoard(@RequestParam String gameId) {
        List<LeaderBoardDTO> leaderBoard = scoreService.getTopLeaderBoard(gameId);
        return ResponseEntity.ok(leaderBoard);
    }

}
