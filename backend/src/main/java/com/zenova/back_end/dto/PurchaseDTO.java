package com.zenova.back_end.dto;


import com.zenova.back_end.entity.Game;
import com.zenova.back_end.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDTO {
    private Long id;
    private User user;
    private Game game;
    private LocalDateTime purchaseDate;
}
