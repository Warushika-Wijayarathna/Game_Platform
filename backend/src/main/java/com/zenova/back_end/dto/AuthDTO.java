package com.zenova.back_end.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Component
public class AuthDTO {
    @Pattern(regexp = "^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$", message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[a-zA-Z0-9-_\\.]+$", message = "Token should be alphanumeric and can include dashes, underscores, and periods")
    private String token;
}
