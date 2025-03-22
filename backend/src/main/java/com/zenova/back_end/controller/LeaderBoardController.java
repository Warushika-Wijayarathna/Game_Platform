package com.zenova.back_end.controller;

import com.zenova.back_end.dto.LeaderBoardDTO;
import com.zenova.back_end.service.LeaderBoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/leaderboard")
public class LeaderBoardController {
    private final LeaderBoardService leaderBoardService;

    public LeaderBoardController(LeaderBoardService leaderBoardService) {
        this.leaderBoardService = leaderBoardService;
    }

    @GetMapping("/top")
    public ResponseEntity<List<LeaderBoardDTO>> getTopLeaderBoard() {
        List<LeaderBoardDTO> leaderBoard = leaderBoardService.getTopLeaderBoard();
        return ResponseEntity.ok(leaderBoard);
    }
}
