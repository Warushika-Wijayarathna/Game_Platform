package com.zenova.back_end.controller;


import com.zenova.back_end.dto.AuthDTO;
import com.zenova.back_end.dto.ResponseDTO;
import com.zenova.back_end.dto.UserDTO;
import com.zenova.back_end.entity.User;
import com.zenova.back_end.service.impl.UserServiceImpl;
import com.zenova.back_end.util.JwtUtil;
import com.zenova.back_end.util.Role;
import com.zenova.back_end.util.VarList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;

@RestController
@RequestMapping("api/v1/auth")
public class  AuthController {

    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl userService;
    private final ResponseDTO responseDTO;

    public AuthController(JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserServiceImpl userService, ResponseDTO responseDTO) {
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.responseDTO = responseDTO;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ResponseDTO> authenticate(@RequestBody UserDTO userDTO) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDTO(VarList.Unauthorized, "Invalid Credentials", e.getMessage()));
        }

        UserDTO loadedUser = userService.loadUserDetailsByUsername(userDTO.getEmail());
        if (loadedUser == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ResponseDTO(VarList.Conflict, "Authorization Failure! Please Try Again", null));
        }

        String token = jwtUtil.generateToken(loadedUser);
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ResponseDTO(VarList.Conflict, "Authorization Failure! Please Try Again", null));
        }

        AuthDTO authDTO = new AuthDTO();
        authDTO.setEmail(loadedUser.getEmail());
        authDTO.setToken(token);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseDTO(VarList.Created, "Success", authDTO));
    }


    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) throws GeneralSecurityException, IOException {
        String accessToken = request.get("token");
        String email = request.get("email");
        String name = request.get("name");

        System.out.println("Google login request received: " + email + ", " + name);

        // Check if the user exists in the database
        UserDTO existingUser = userService.loadUserDetailsByUsername(email);

        Role role = email.endsWith("@zplay.com") ? Role.ADMIN : Role.USER;

        // If user doesn't exist, create a new user
        if (existingUser == null) {
            UserDTO newUserDTO = new UserDTO();
            newUserDTO.setEmail(email);
            newUserDTO.setName(name);
            newUserDTO.setRole(role);
            newUserDTO.setActive(true);
            // Set a random password or use a special flag for OAuth users
            newUserDTO.setPassword(generateRandomPassword());
            // Save the new user
            try {
                userService.saveUser(newUserDTO);
                System.out.println("New Google user registered: " + email);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ResponseDTO(VarList.Internal_Server_Error, "Failed to register Google user", null));
            }
            existingUser = newUserDTO; // Assign the newly created user
        }

        // Generate JWT using the loaded or newly created user
        String token = jwtUtil.generateToken(existingUser);

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ResponseDTO(VarList.Conflict, "Authorization Failure! Please Try Again", null));
        }

        // Create auth response with token
        AuthDTO authDTO = new AuthDTO();
        authDTO.setEmail(existingUser.getEmail());
        authDTO.setToken(token);

        System.out.println("Google login successful: " + email);
        System.out.println("Generated token: " + token);

        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setCode(VarList.OK);
        responseDTO.setMessage("Login successful");
        responseDTO.setData(authDTO);
        return ResponseEntity.ok(responseDTO);
    }

    private String generateRandomPassword() {
        // Generate a secure random password
        return java.util.UUID.randomUUID().toString();
    }

}

