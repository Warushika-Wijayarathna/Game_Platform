package com.zenova.back_end.repo;

import com.zenova.back_end.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game,String> {
}
