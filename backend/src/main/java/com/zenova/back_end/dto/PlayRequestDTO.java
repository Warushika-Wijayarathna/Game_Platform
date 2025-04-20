package com.zenova.back_end.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayRequestDTO {
    @Positive(message = "Game ID must be a positive number")
    private Long gameId;

    @Min(value = 0, message = "Score value must be at least 0")
    private int scoreValue;
}
