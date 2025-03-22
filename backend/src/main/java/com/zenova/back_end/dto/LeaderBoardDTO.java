package com.zenova.back_end.dto;

import com.zenova.back_end.entity.Game;
import com.zenova.back_end.entity.Score;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderBoardDTO {
    private Long id;
    private Game game;
    private Score score;
    private int rank;
}
