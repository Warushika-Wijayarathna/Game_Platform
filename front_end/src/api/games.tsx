import axios from 'axios';

const API_URL = 'http://localhost:8080/api/games';

export const saveGame = async (gameData: Record<string, any>) => {
    try {
        const response = await axios.post(API_URL, gameData);
        return response.data;
    } catch (error) {
        console.error('Error saving game:', error);
        throw error;
    }
};

