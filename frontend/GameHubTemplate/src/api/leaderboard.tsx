import axios from "axios";

export const getLeaderboardForGame = async (gameId: string) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/leaderboard/top`, {
            params: { gameId },
        });
        return response.data;
        console.log("Leaderboard data:", response.data);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return null;
    }
};
