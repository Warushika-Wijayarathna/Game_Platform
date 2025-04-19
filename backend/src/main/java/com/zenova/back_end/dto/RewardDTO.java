package com.zenova.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RewardDTO {
    private int dayOfWeek;
    private String dayName;
    private int points;
    private boolean claimed;
    private boolean claimable;
}
