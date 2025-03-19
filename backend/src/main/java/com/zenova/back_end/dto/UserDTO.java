package com.zenova.back_end.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {
    private Long id;
    @Email(message = "Email should be valid")
    private String email;
    private String password;
    @Pattern(regexp = "^[a-zA-Z0-9]*$", message = "Name should be alphanumeric")
    @Size(min = 3, max = 20, message = "Name should be between 3 and 20 characters")
    private String name;
    private String role;

    public UserDTO(String userEmail) {
        this.email = userEmail;
    }
}
