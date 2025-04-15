package com.zenova.back_end.service.impl;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class LiveKitTokenService {

    @Value("${livekit.api.key}")
    private String apiKey;

    @Value("${livekit.api.secret}")
    private String apiSecret;

    public String createToken(String gameId, String role) {
        String identity = UUID.randomUUID().toString();
        AccessToken token = new AccessToken(apiKey, apiSecret);

        token.setName("user-" + identity);
        token.setIdentity(identity);

        token.addGrants(new RoomJoin(true), new RoomName(gameId));

        return token.toJwt();
    }
}
