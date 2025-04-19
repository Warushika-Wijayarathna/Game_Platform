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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
