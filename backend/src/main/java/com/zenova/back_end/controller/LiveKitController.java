package com.zenova.back_end.controller;

import com.zenova.back_end.dto.LiveKitTokenRequest;
import com.zenova.back_end.dto.LiveKitTokenResponse;
import com.zenova.back_end.service.impl.LiveKitTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/livekit")
public class LiveKitController {

    @Autowired
    private LiveKitTokenService tokenService;

    @PostMapping("/token")
    public LiveKitTokenResponse generateToken(@RequestBody LiveKitTokenRequest request) {
        String token = tokenService.createToken(request.getGameId(), request.getRole());
        return new LiveKitTokenResponse(token);
    }
}
