package com.zenova.back_end.controller;

import com.zenova.back_end.dto.GameDTO;
import com.zenova.back_end.dto.ResponseDTO;
import com.zenova.back_end.service.GameService;
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

    public GameController(GameService gameService, JwtUtil jwtUtil) {
        this.gameService = gameService;
        this.jwtUtil = jwtUtil;
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
        System.out.println("=============================================");
        System.out.println("Received data: " + games);
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
}
