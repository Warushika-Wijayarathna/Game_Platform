package com.zenova.back_end.service;


import com.zenova.back_end.dto.UserDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface UserService {
    int saveUser(UserDTO userDTO);
    UserDTO searchUser(String username);

    int loginUser(@Valid UserDTO userDTO);

    List<UserDTO> getAllUsers();

    void updateUser(UserDTO userDTO);

    void deactivateUser(UserDTO userDTO);

    List<UserDTO> getAllDevelopers();

    UserDTO getUserByEmail(String email);
}
