package com.zenova.back_end.service.impl;

import com.zenova.back_end.dto.LeaderBoardDTO;
import com.zenova.back_end.entity.LeaderBoard;
import com.zenova.back_end.repo.LeaderBoardRepository;
import com.zenova.back_end.service.LeaderBoardService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LeaderBoardServiceImpl implements LeaderBoardService {
    @Autowired
    ModelMapper modelMapper;

    @Autowired
    LeaderBoardRepository leaderBoardRepository;

    @Override
    public List<LeaderBoardDTO> getTopLeaderBoard() {
        List<LeaderBoard> topLeaderBoards = leaderBoardRepository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(LeaderBoard::getRank))
                .limit(10)
                .collect(Collectors.toList());
        return topLeaderBoards.stream()
                .map(leaderBoard -> modelMapper.map(leaderBoard, LeaderBoardDTO.class))
                .collect(Collectors.toList());
    }
}
