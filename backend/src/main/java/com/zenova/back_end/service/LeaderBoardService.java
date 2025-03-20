package com.zenova.back_end.service;

import com.zenova.back_end.dto.LeaderBoardDTO;

import java.util.List;

public interface LeaderBoardService {
    List<LeaderBoardDTO> getTopLeaderBoard();
}
