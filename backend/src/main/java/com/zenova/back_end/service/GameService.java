package com.zenova.back_end.service;

import com.zenova.back_end.dto.GameDTO;

public interface GameService {
    // basic game crud
    void addGame(GameDTO gameDTO);
    void updateGame(GameDTO gameDTO);
    void deleteGame(GameDTO gameDTO);
    void getGame();
    void getGames();

}
