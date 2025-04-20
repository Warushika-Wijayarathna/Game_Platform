package com.zenova.back_end.controller;

import com.zenova.back_end.dto.ResponseDTO;
import com.zenova.back_end.dto.RewardDTO;
import com.zenova.back_end.dto.UserDTO;
import com.zenova.back_end.service.ScoreService;
import com.zenova.back_end.service.UserService;
import com.zenova.back_end.util.JwtUtil;
import com.zenova.back_end.util.VarList;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/reward")
public class RewardController {

    @Autowired
    private ScoreService scoreService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserService userService;

    @GetMapping(value = "/weekly")
    public ResponseEntity<ResponseDTO> getWeeklyReward(@RequestHeader("Authorization") String token) {
        String tokens = token.replace("Bearer ", "");
        Claims claims = jwtUtil.getAllClaimsFromToken(tokens);
        String email = claims.getSubject();

        UserDTO user = userService.getUserByEmail(email);

        System.out.println("User ID------------------------------------------------------------------------------------------: " + user);

        List<RewardDTO> weekly_rewards = scoreService.getWeeklyReward(user);
        if (weekly_rewards.isEmpty()) {
            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "No weekly rewards found", null));
        }

        for (RewardDTO reward : weekly_rewards) {
            System.out.println("Reward ID: " + reward.getDayName());
            System.out.println("Reward Amount: " + reward.getPoints());
            System.out.println("Reward Date: " + reward.getDayOfWeek());
        }

        return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Weekly rewards are fetched", weekly_rewards));
    }

    @PostMapping(value = "/claim/{dayOfWeek}")
    public ResponseEntity<ResponseDTO> claimReward(
            @RequestHeader("Authorization") String token,
            @PathVariable int dayOfWeek) {
        try {
            String tokens = token.replace("Bearer ", "");
            Claims claims = jwtUtil.getAllClaimsFromToken(tokens);
            String email = claims.getSubject();

            UserDTO user = userService.getUserByEmail(email);

            scoreService.claimReward(user, dayOfWeek);

            return ResponseEntity.ok(new ResponseDTO(VarList.OK, "Reward claimed successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }

    @GetMapping("/totalPoints")
    public ResponseEntity<Map<String, Integer>> getTotalPoints(@RequestHeader("Authorization") String token) {
        try {
            String tokens = token.replace("Bearer ", "");
            Claims claims = jwtUtil.getAllClaimsFromToken(tokens);
            String email = claims.getSubject();

            int totalPoints = scoreService.getTotalPointsByEmail(email);

            Map<String, Integer> response = new HashMap<>();
            response.put("totalPoints", totalPoints);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
