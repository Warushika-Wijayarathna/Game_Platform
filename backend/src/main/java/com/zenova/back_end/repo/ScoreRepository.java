package com.zenova.back_end.repo;

import com.zenova.back_end.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<Score, String> {
}
