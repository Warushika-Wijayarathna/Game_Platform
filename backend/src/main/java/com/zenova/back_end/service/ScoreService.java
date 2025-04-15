package com.zenova.back_end.service;

import com.zenova.back_end.dto.LeaderBoardDTO;
import com.zenova.back_end.dto.ScoreDTO;

import java.util.List;

public interface ScoreService {
    ScoreDTO addScore(ScoreDTO score);

    List<LeaderBoardDTO> getTopLeaderBoard(String gameId);
}
