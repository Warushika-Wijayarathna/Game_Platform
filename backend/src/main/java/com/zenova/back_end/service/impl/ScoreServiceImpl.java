package com.zenova.back_end.service.impl;

import com.zenova.back_end.dto.*;
import com.zenova.back_end.entity.Game;
import com.zenova.back_end.entity.RewardEntry;
import com.zenova.back_end.entity.Score;
import com.zenova.back_end.entity.User;
import com.zenova.back_end.repo.GameRepository;
import com.zenova.back_end.repo.RewardEntryRepository;
import com.zenova.back_end.repo.ScoreRepository;
import com.zenova.back_end.repo.UserRepository;
import com.zenova.back_end.service.ScoreService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ScoreServiceImpl implements ScoreService {
    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private RewardEntryRepository rewardEntryRepository;

    @Transactional
    @Override
    public ScoreDTO addScore(ScoreDTO score) {
        Game game = gameRepository.getReferenceById(String.valueOf(score.getGame().getId()));
        User user = userRepository.getReferenceByEmail((score.getUser().getEmail()));

        score.setGame(modelMapper.map(game, GameDTO.class));
        score.setUser(modelMapper.map(user, UserDTO.class));

        Score scoreEntity = modelMapper.map(score, Score.class);
        Score savedScore = scoreRepository.save(scoreEntity);

        scoreEntity.setCreatedAt(LocalDateTime.now());

        ScoreDTO savedScoreDTO = modelMapper.map(savedScore, ScoreDTO.class);

        return savedScoreDTO;
    }

    @Override
    public List<LeaderBoardDTO> getTopLeaderBoard(String gameId) {
        List<LeaderBoardDTO> leaderBoard = scoreRepository.findTopScoresByGameId(gameId);
        return leaderBoard;
    }

    @Override
    public List<RewardDTO> getWeeklyReward(UserDTO user) {
        List<ScoreDTO> scores = scoreRepository.findAllByUid(UUID.fromString(String.valueOf(user.getUid())))
                .stream()
                .map(score -> modelMapper.map(score, ScoreDTO.class))
                .collect(Collectors.toList());
        int totalScore = scores.stream().mapToInt(ScoreDTO::getScore).sum();

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        List<RewardEntry> rewards = rewardEntryRepository.findByUserIdAndWeekStartDate(String.valueOf((user.getUid())), weekStart);

        if (rewards.isEmpty()) {
            rewards = generateWeeklyRewards(String.valueOf(user.getUid()), weekStart, totalScore);
        }

        return rewards.stream()
                .map(entry -> convertToDTO(entry, today))
                .collect(Collectors.toList());
    }

    private List<RewardEntry> generateWeeklyRewards(String userId, LocalDate weekStart, int totalScore) {
        int dailyPoints = calculateDailyPoints(totalScore);
        List<RewardEntry> entries = new ArrayList<>();

        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found."));

        for (int day = 1; day <= 7; day++) {
            RewardEntry entry = new RewardEntry();
            entry.setUser(user);
            entry.setWeekStartDate(weekStart);
            entry.setDayOfWeek(day);
            entry.setPoints(dailyPoints);
            entry.setClaimed(false);
            entries.add(entry);
        }

        return rewardEntryRepository.saveAll(entries);
    }

    private int calculateDailyPoints(int totalScore) {
        if (totalScore >= 5000) return 100;
        else if (totalScore >= 2000) return 50;
        else return 10;
    }

    private RewardDTO convertToDTO(RewardEntry entry, LocalDate today) {
        LocalDate rewardDate = entry.getWeekStartDate().plusDays(entry.getDayOfWeek() - 1);
        boolean isClaimable = !rewardDate.isAfter(today);

        String dayName = DayOfWeek.of(entry.getDayOfWeek()).getDisplayName(TextStyle.FULL, Locale.getDefault());

        return new RewardDTO(
                entry.getDayOfWeek(),
                dayName,
                entry.getPoints(),
                entry.isClaimed(),
                isClaimable
        );
    }

    public void claimReward(UserDTO user, int dayOfWeek) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        RewardEntry entry = rewardEntryRepository.findByUserIdAndWeekStartDateAndDayOfWeek(
                String.valueOf(user.getUid()), weekStart, dayOfWeek
        );

        if (entry == null) {
            throw new RuntimeException("Reward not found.");
        }

        LocalDate rewardDate = entry.getWeekStartDate().plusDays(dayOfWeek - 1);
        if (rewardDate.isAfter(today)) {
            throw new RuntimeException("Reward is not claimable yet.");
        }

        if (entry.isClaimed()) {
            throw new RuntimeException("Reward already claimed.");
        }

        entry.setClaimed(true);
        rewardEntryRepository.save(entry);

    }

}
