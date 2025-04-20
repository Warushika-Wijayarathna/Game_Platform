package com.zenova.back_end.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RewardDTO {
    private int dayOfWeek;

    @Pattern(regexp = "^[A-Za-z]+$", message = "Day name must contain only letters")
    private String dayName;

    private int points;
    private boolean claimed;
    private boolean claimable;
}
