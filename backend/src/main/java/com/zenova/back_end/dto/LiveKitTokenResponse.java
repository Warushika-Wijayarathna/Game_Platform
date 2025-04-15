package com.zenova.back_end.dto;

public class LiveKitTokenResponse {
    private final String token;

    public LiveKitTokenResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
