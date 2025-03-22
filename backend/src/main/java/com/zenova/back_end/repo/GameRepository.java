package com.zenova.back_end.repo;

import com.zenova.back_end.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, String> {
    void deleteById(String id);

    List<Game> findAll();

    List<Game> findAllByActiveTrue();
}
