package com.zenova.back_end.dto;

import com.zenova.back_end.util.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {
    private UUID uid;
    @Email(message = "Email should be valid")
    private String email;
    private String password;
    @Pattern(regexp = "^[a-zA-Z0-9]*$", message = "Name should be alphanumeric")
    @Size(min = 3, max = 20, message = "Name should be between 3 and 20 characters")
    private String name;
    private Role role;

    public UserDTO(String userEmail) {
        this.email = userEmail;
    }
}
