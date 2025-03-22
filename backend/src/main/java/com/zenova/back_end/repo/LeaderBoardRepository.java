package com.zenova.back_end.repo;

import com.zenova.back_end.entity.LeaderBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeaderBoardRepository extends JpaRepository<LeaderBoard, String> {

    @Query("SELECT COUNT(l) + 1 FROM LeaderBoard l " +
            "JOIN Score s ON l.score.id = s.id " +
            "WHERE l.game.id = :gameId AND s.score > " +
            "(SELECT s2.score FROM Score s2 WHERE s2.user.email = :email AND s2.game.id = :gameId)")
    int getRank(@Param("gameId") Long gameId, @Param("email") String email);
}
