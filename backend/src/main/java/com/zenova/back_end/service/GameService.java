package com.zenova.back_end.service;

import com.zenova.back_end.dto.GameDTO;
import com.zenova.back_end.dto.UserDTO;

import java.util.List;

public interface GameService {
    Object addGame(GameDTO gameDTO);
    Object updateGame(GameDTO gameDTO);
    void deleteGame(Long id);
    GameDTO getGame(Long id);
    List<GameDTO> getAllGames();

    Object deactivateGame(Long id);

    List<GameDTO> getAllActiveGames();

    Object uploadGame(GameDTO gameDTO, UserDTO userDTO);

    GameDTO getGameById(Long id);

    List<GameDTO> getGamesUploadedByUser(String email);
}
