package com.zenova.back_end.service.impl;

import com.zenova.back_end.dto.GameDTO;
import com.zenova.back_end.repo.GameRepository;
import com.zenova.back_end.service.GameService;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameServiceImpl implements GameService {
    @Autowired
    private final GameRepository gameRepository;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public void addGame(GameDTO gameDTO) {

    }

    @Override
    public void updateGame(GameDTO gameDTO) {

    }

    @Override
    public void deleteGame(GameDTO gameDTO) {

    }

    @Override
    public void getGame() {

    }

    @Override
    public void getGames() {

    }
}
