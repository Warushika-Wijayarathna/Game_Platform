export const generateLiveKitToken = async (isStreamer: boolean, gameId: string, role: "streamer" | "viewer") => {
    const response = await fetch(`http://localhost:8080/api/livekit/token`, {
        method: "POST",
        body: JSON.stringify({ gameId, role }),
        headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data.token;
};
