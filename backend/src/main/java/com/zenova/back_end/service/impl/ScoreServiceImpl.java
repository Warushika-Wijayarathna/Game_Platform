package com.zenova.back_end.service.impl;

import com.zenova.back_end.dto.GameDTO;
import com.zenova.back_end.dto.ScoreDTO;
import com.zenova.back_end.dto.UserDTO;
import com.zenova.back_end.entity.Game;
import com.zenova.back_end.entity.Score;
import com.zenova.back_end.entity.User;
import com.zenova.back_end.repo.GameRepository;
import com.zenova.back_end.repo.LeaderBoardRepository;
import com.zenova.back_end.repo.ScoreRepository;
import com.zenova.back_end.repo.UserRepository;
import com.zenova.back_end.service.ScoreService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ScoreServiceImpl implements ScoreService {
    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private LeaderBoardRepository leaderBoardRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    @Override
    public ScoreDTO addScore(ScoreDTO score) {
        Game game = gameRepository.getReferenceById(String.valueOf(score.getGame().getId()));
        User user = userRepository.getReferenceById(UUID.fromString(score.getUser().getEmail()));

        score.setGame(modelMapper.map(game, GameDTO.class));
        score.setUser(modelMapper.map(user, UserDTO.class));

        Score scoreEntity = modelMapper.map(score, Score.class);
        Score savedScore = scoreRepository.save(scoreEntity);

        ScoreDTO savedScoreDTO = modelMapper.map(savedScore, ScoreDTO.class);

        return savedScoreDTO;
    }

    @Override
    public int getRank(ScoreDTO savedScore) {
        return leaderBoardRepository.getRank(savedScore.getGame().getId(), savedScore.getUser().getEmail());
    }
}
