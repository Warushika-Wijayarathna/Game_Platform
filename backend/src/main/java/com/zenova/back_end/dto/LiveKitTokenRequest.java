package com.zenova.back_end.dto;

public class LiveKitTokenRequest {
    private String gameId;
    private String role;

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
