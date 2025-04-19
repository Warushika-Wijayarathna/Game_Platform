package com.zenova.back_end.repo;

import com.zenova.back_end.dto.LeaderBoardDTO;
import com.zenova.back_end.dto.ScoreDTO;
import com.zenova.back_end.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScoreRepository extends JpaRepository<Score, UUID> {
    @Query("SELECT new com.zenova.back_end.dto.LeaderBoardDTO(s.user, SUM(s.score)) " +
           "FROM Score s WHERE s.game.id = :gameId " +
           "GROUP BY s.user.uid, s.user.name " +
           "ORDER BY SUM(s.score) DESC")
    List<LeaderBoardDTO> findTopScoresByGameId(@Param("gameId") String gameId);

    @Query("SELECT s FROM Score s WHERE s.user.uid = :uuid")
    List<Score> findAllByUid(@Param("uuid") UUID uuid);
}
