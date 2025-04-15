package com.zenova.back_end.repo;

import com.zenova.back_end.dto.LeaderBoardDTO;
import com.zenova.back_end.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, String> {
    @Query("SELECT new com.zenova.back_end.dto.LeaderBoardDTO(s.user, SUM(s.score)) " +
           "FROM Score s WHERE s.game.id = :gameId " +
           "GROUP BY s.user.uid, s.user.name " +
           "ORDER BY SUM(s.score) DESC")
    List<LeaderBoardDTO> findTopScoresByGameId(@Param("gameId") String gameId);
}
