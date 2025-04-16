package com.zenova.back_end.service;


import com.zenova.back_end.dto.UserDTO;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

public interface UserService {
    int saveUser(UserDTO userDTO);
    UserDTO searchUser(String username);

    int loginUser(@Valid UserDTO userDTO);

    List<UserDTO> getAllUsers();

    void updateUser(UserDTO userDTO);

    void deactivateUser(UUID userId);

    List<UserDTO> getAllDevelopers();

    UserDTO getUserByEmail(String email);

    void activateUser(UUID userId);

    boolean validatePassword(String email, String existingPassword);

    void updatePassword(String email, String newPassword);
}
