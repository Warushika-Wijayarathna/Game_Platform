import axios from "axios";

export const saveGameScore = async (gameId: string, scoreValue: number): Promise<void> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }

        await axios.post(
            "http://localhost:8080/api/v1/play/game",
            { gameId: gameId, scoreValue: scoreValue },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error("Failed to save game score:", error);
        throw error;
    }
};
