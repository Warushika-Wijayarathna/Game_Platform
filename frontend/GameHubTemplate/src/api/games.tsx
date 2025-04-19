import axios from "axios";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface Games {
    id: string;
    name: string;
    description: string;
    category: { id: number; name: string; active: boolean };
    rules: string;
    price: string;
    image: string;
    hostedUrl: string;
    active: boolean;
    uploadedBy: User;
    isApproved: boolean;
}

const BASE_URL = "http://localhost:8080/api/v1/game";
const API_TIMEOUT = 10000;


export const fetchAllGames = async (): Promise<Games[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      timeout: API_TIMEOUT
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Invalid API response format');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Network Error';
      throw new Error(`Failed to fetch games: ${message}`);
    }
    throw new Error('Failed to load games. Please try again later.');
  }
};

export const uploadDeveloperGames = async (game: Games): Promise<Games> => {
        console.log('Uploading game:', game);
        const gameJson = JSON.stringify(game);

        const response = await axios.post(`${BASE_URL}/upload`, gameJson, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        timeout: API_TIMEOUT
        });

        return response.data;
}

export const getGameById = async (gameId: string): Promise<Games> => {
    try {
        const response = await axios.get(`${BASE_URL}/${gameId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            timeout: API_TIMEOUT
        });

        if (!response.data || typeof response.data !== 'object') {
            throw new Error('Invalid game data format');
        }

        // Add validation for required fields
        const requiredFields = ['id', 'name', 'hostedUrl'];
        const missingFields = requiredFields.filter(field => !(field in response.data));

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        return response.data as Games;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Game not found';
            throw new Error(`Failed to fetch game: ${message}`);
        }
        throw new Error('Failed to load game details');
    }
};
