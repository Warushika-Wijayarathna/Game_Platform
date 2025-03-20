package com.zenova.back_end.controller;

import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import com.zenova.back_end.dto.AuthDTO;
import com.zenova.back_end.dto.ResponseDTO;
import com.zenova.back_end.dto.UserDTO;
import com.zenova.back_end.service.UserService;
import com.zenova.back_end.util.JwtUtil;
import com.zenova.back_end.util.VarList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
                        userDTO.setRole("ADMIN");
                    } else {
                        userDTO.setRole("USER");
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

    private boolean isAdmin(String token) {
        Claims claims = jwtUtil.getUserRoleCodeFromToken(token);
        return "ADMIN".equals(claims.get("role", String.class));
    }

    @GetMapping(value = "/getAll")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping(value = "/update")
    public ResponseEntity<ResponseDTO> updateUser(@RequestHeader("Authorization") String token, @RequestBody UserDTO userDTO) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        userService.updateUser(userDTO);
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "User Updated", null));
    }

    @PostMapping(value = "/deactivate")
    public ResponseEntity<ResponseDTO> deactivateUser(@RequestHeader("Authorization") String token, @RequestBody UserDTO userDTO) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        userService.deactivateUser(userDTO);
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "User Deactivated", null));
    }


}
