package com.zenova.back_end.controller;

import com.zenova.back_end.util.Role;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import com.zenova.back_end.dto.AuthDTO;
import com.zenova.back_end.dto.ResponseDTO;
import com.zenova.back_end.dto.UserDTO;
import com.zenova.back_end.service.UserService;
import com.zenova.back_end.util.JwtUtil;
import com.zenova.back_end.util.VarList;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/user")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping(value = "/register")
    public ResponseEntity<ResponseDTO> registerUser(@Valid @RequestBody UserDTO userDTO) {
        try {
            int res = userService.saveUser(userDTO);
            switch (res) {
                case VarList.Created -> {
                    if (userDTO.getEmail().endsWith("@zplay.com")) {
                        userDTO.setRole(Role.ADMIN);
                    } else {
                        userDTO.setRole(Role.USER);
                    }
                    String token = jwtUtil.generateToken(userDTO);
                    AuthDTO authDTO = new AuthDTO();
                    authDTO.setEmail(userDTO.getEmail());
                    authDTO.setToken(token);
                    return ResponseEntity.status(HttpStatus.CREATED)
                            .body(new ResponseDTO(VarList.Created, "Success", authDTO));
                }
                case VarList.Not_Acceptable -> {
                    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                            .body(new ResponseDTO(VarList.Not_Acceptable, "Email Already Used", null));
                }
                default -> {
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                            .body(new ResponseDTO(VarList.Bad_Gateway, "Error", null));
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

//    @PostMapping(value = "/login") // Use POST instead of GET for login
//    public ResponseEntity<ResponseDTO> loginUser(@Valid @RequestBody UserDTO userDTO) {
//        System.out.println("Login User===================================================");
//        System.out.println("Request: " + userDTO);
//        try {
//            int res = userService.loginUser(userDTO);
//            switch (res) {
//                case VarList.OK -> {
//                    String token = jwtUtil.generateToken(userDTO);
//                    AuthDTO authDTO = new AuthDTO();
//                    authDTO.setEmail(userDTO.getEmail());
//                    authDTO.setToken(token);
//                    return ResponseEntity.status(HttpStatus.OK)
//                            .body(new ResponseDTO(VarList.OK, "Success", authDTO));
//                }
//                case VarList.Not_Found -> {
//                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                            .body(new ResponseDTO(VarList.Not_Found, "User Not Found", null));
//                }
//                case VarList.Unauthorized -> {
//                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                            .body(new ResponseDTO(VarList.Unauthorized, "Invalid Password", null));
//                }
//                default -> {
//                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
//                            .body(new ResponseDTO(VarList.Bad_Gateway, "Error", null));
//                }
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
//        }
//    }

    @GetMapping(value = "/getAll")
    public ResponseEntity<ResponseDTO> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Success", users));
    }

    @PutMapping(value = "/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> updateUser(HttpServletRequest request, @RequestBody UserDTO userDTO) {
        userService.updateUser(userDTO);
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "User Updated", null));
    }

    @PostMapping(value = "/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deactivateUser(HttpServletRequest request, @RequestBody UUID userId) {
        System.out.println("Deactivating user with ID: " + userId);
        userService.deactivateUser(userId);
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "User Deactivated", null));
    }

    @PostMapping(value = "/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> activateUser(HttpServletRequest request, @RequestBody UUID userId) {
        System.out.println("Activating user with ID: " + userId);
        userService.activateUser(userId);
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "User Activated", null));
    }

    @GetMapping(value = "/all-developers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllDevelopers(HttpServletRequest request) {
        List<UserDTO> developers = userService.getAllDevelopers();
        return ResponseEntity.ok(developers);
    }

    @GetMapping(value = "/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String authHeader) {
        try {
            // Remove the "Bearer " prefix from the token
            String token = authHeader.replace("Bearer ", "");
            System.out.println("Parsed Token: " + token); // Log the parsed token

            Claims claims = jwtUtil.getAllClaimsFromToken(token);
            String email = claims.getSubject(); // Use getSubject() instead of claims.get("email")
            System.out.println("Email: " + email);

            UserDTO userDTO = userService.getUserByEmail(email);
            return ResponseEntity.ok(userDTO);
        } catch (io.jsonwebtoken.io.DecodingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO(VarList.Bad_Request, "Invalid token format", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @PutMapping(value = "/updateInfo")
    public ResponseEntity<ResponseDTO> updateUserInfo(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> userInfo) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Claims claims = jwtUtil.getAllClaimsFromToken(token);
            String email = claims.getSubject();

            String existingPassword = userInfo.get("existingPassword");
            String newPassword = userInfo.get("password");

            if (existingPassword == null || newPassword == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseDTO(VarList.Bad_Request, "Both existing and new passwords are required", null));
            }

            boolean isValid = userService.validatePassword(email, existingPassword);
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDTO(VarList.Unauthorized, "Invalid existing password", null));
            }

            userService.updatePassword(email, newPassword);

            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Password updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @PutMapping(value = "/updateInfos")
    public ResponseEntity<ResponseDTO> updateUserInfos(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, UserDTO> userInfo) {

        try {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String hashedPassword = passwordEncoder.encode("1234");
            System.out.println("Hashed Password: " + hashedPassword);

            String token = authHeader.replace("Bearer ", "");
            Claims claims = jwtUtil.getAllClaimsFromToken(token);
            String email = claims.getSubject();

            String existingPassword = userInfo.get("password").getEmail();
            UserDTO newUserInfo = userInfo.get("userInfo");

            System.out.println("Existing Password: " + existingPassword);
            System.out.println("New User Info: " + newUserInfo);


            if (existingPassword == null || newUserInfo == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseDTO(VarList.Bad_Request, "Both existing password and new user info are required", null));
            }

            boolean isValid = userService.validatePassword(email, existingPassword);
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDTO(VarList.Unauthorized, "Invalid existing password", null));
            }

            userService.updateUser(newUserInfo);

            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "User info updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }
}


