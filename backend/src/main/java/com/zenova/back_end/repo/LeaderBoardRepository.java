package com.zenova.back_end.repo;

import com.zenova.back_end.entity.LeaderBoard;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaderBoardRepository extends JpaRepository<LeaderBoard, String> {
    int getRank(Long id, @Email(message = "Email should be valid") String email);
}
