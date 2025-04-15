package com.zenova.back_end.service.impl;

import io.livekit.server.AccessToken;
import io.livekit.server.VideoGrants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LiveKitService {

    @Value("${livekit.api-key}")
    private String apiKey;

    @Value("${livekit.secret}")
    private String secret;

    public String createToken(String roomName, String identity, boolean isPublisher) {
        VideoGrants grants = new VideoGrants()
                .setRoom(roomName)
                .setRoomJoin(true)
                .setCanPublish(isPublisher)
                .setCanSubscribe(true);

        AccessToken token = new AccessToken(apiKey, secret)
                .setIdentity(identity)
                .setVideoGrant(grants);

        return token.toJwt();
    }
}
