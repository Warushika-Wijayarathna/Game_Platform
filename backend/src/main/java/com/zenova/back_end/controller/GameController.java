package com.zenova.back_end.controller;

import com.zenova.back_end.dto.GameDTO;
import com.zenova.back_end.dto.ResponseDTO;
import com.zenova.back_end.dto.UserDTO;
import com.zenova.back_end.service.GameService;
import com.zenova.back_end.service.UserService;
import com.zenova.back_end.util.JwtUtil;
import com.zenova.back_end.util.VarList;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/game")
public class GameController {
    private final GameService gameService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public GameController(GameService gameService, JwtUtil jwtUtil, UserService userService) {
        this.gameService = gameService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> addGame(HttpServletRequest request, @RequestBody GameDTO gameDTO) {
        // show received data
        System.out.println("=============================================");
        System.out.println("Received data: " + gameDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseDTO(VarList.Created, "Game Added", gameService.addGame(gameDTO)));
    }

    @GetMapping("/all")
    public ResponseEntity<List<GameDTO>> getAllGames() {
        List<GameDTO> games = gameService.getAllGames();
        return ResponseEntity.ok(games);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> updateGame(@RequestHeader("Authorization") String token, @RequestBody GameDTO gameDTO) {
        System.out.println("=============================================Update=======================");
        System.out.println("Received data: " + gameDTO);
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Game Updated", gameService.updateGame(gameDTO)));
    }

    @PostMapping("/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deactivateGame(@RequestHeader("Authorization") String token, @RequestParam Long id) {
        System.out.println("=============================================Deactivate=======================");
        System.out.println("Received data: " + id);
        Object gameDTO = gameService.deactivateGame(id);
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Game Deactivated", gameService.deactivateGame(id)));
    }

    @GetMapping("/all-active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GameDTO>> getAllActiveGames() {
        return ResponseEntity.ok(gameService.getAllActiveGames());
    }

    @PostMapping("/purchase")
    public ResponseEntity<ResponseDTO> purchaseGame(@RequestHeader("Authorization") String token, @RequestParam Long id) {
        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Game Purchased", gameService.purchaseGame(token, id)));
    }

    @PostMapping("/upload")
    public ResponseEntity<ResponseDTO> uploadGame(@RequestHeader("Authorization") String token, @RequestBody GameDTO gameDTO) {
        String tokens = token.replace("Bearer ", "");
        System.out.println("Parsed Token: " + tokens);

        // receive data
        System.out.println("=============================================");
        System.out.println("Received data: " + gameDTO);

        Claims claims = jwtUtil.getAllClaimsFromToken(tokens);
        String email = claims.getSubject();
        System.out.println("Email: " + email);

        UserDTO userDTO = userService.getUserByEmail(email);


        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Game Uploaded", gameService.uploadGame(gameDTO, userDTO)));



    }
}
