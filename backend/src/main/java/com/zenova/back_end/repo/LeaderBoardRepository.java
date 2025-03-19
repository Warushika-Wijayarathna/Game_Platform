package com.zenova.back_end.repo;

import com.zenova.back_end.entity.LeaderBoard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaderBoardRepository extends JpaRepository<LeaderBoard, String> {
}
