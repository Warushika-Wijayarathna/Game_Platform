package com.zenova.back_end.service;


import com.zenova.back_end.dto.UserDTO;
import jakarta.validation.Valid;

public interface UserService {
    int saveUser(UserDTO userDTO);
    UserDTO searchUser(String username);

    int loginUser(@Valid UserDTO userDTO);
}
