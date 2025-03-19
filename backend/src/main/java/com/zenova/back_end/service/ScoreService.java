package com.zenova.back_end.service;

import com.zenova.back_end.dto.ScoreDTO;

public interface ScoreService {
    ScoreDTO addScore(ScoreDTO score);

    int getRank(ScoreDTO savedScore);
}
