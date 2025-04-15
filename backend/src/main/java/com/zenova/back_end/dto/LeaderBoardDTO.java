package com.zenova.back_end.dto;

import com.zenova.back_end.entity.Game;
import com.zenova.back_end.entity.Score;
import com.zenova.back_end.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderBoardDTO {
    private User user;
    private double totalScore;
}
