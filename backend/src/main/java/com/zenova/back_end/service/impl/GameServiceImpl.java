package com.zenova.back_end.service.impl;

import com.zenova.back_end.dto.GameDTO;
import com.zenova.back_end.entity.Game;
import com.zenova.back_end.repo.GameRepository;
import com.zenova.back_end.service.GameService;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {
    @Autowired
    private final GameRepository gameRepository;

    @Autowired
    ModelMapper modelMapper;

    public GameServiceImpl(GameRepository gameRepository) {
        this.gameRepository = gameRepository;

    }

    @Override
    public GameDTO addGame(GameDTO gameDTO) {
        Game game = modelMapper.map(gameDTO, Game.class);
        game = gameRepository.save(game);
        return modelMapper.map(game, GameDTO.class);
    }

    @Override
    public GameDTO updateGame(GameDTO gameDTO) {
        Game game = gameRepository.findById(String.valueOf(gameDTO.getId()))
                .orElseThrow(() -> new RuntimeException("Game not found"));
        modelMapper.map(gameDTO, game);
        game = gameRepository.save(game);
        return modelMapper.map(game, GameDTO.class);
    }

    @Override
    public void deleteGame(Long id) {
        gameRepository.deleteById(String.valueOf(id));
    }

    @Override
    public GameDTO getGame(Long id) {
        Game game = gameRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return modelMapper.map(game, GameDTO.class);
    }

    @Override
    public List<GameDTO> getAllGames() {
        List<Game> games = gameRepository.findAll();
        return games.stream()
                .map(game -> modelMapper.map(game, GameDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Object deactivateGame(Long id) {
        Game game = gameRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Game not found"));
        game.setActive(false);
        game = gameRepository.save(game);
        return modelMapper.map(game, GameDTO.class);
    }

    @Override
    public List<GameDTO> getAllActiveGames() {
        List<Game> games = gameRepository.findAllByActiveTrue();
        return games.stream()
                .map(game -> modelMapper.map(game, GameDTO.class))
                .collect(Collectors.toList());
    }

}
