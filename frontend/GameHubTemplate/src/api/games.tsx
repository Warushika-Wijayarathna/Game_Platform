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
  category: string;
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

const validateGame = (game: any): Games => {
  if (!game.id || typeof game.name !== 'string') {
    throw new Error('Invalid game data structure');
  }

  return {
    id: game.id,
    name: game.name || 'Untitled Game',
    description: game.description || '',
    category: game.category?.name || game.category || 'Uncategorized',
    rules: game.rules || '',
    price: game.price || 'Free',
    image: game.image || '/fallback-game.png',
    hostedUrl: game.hostedUrl || '#',
    active: game.active || false,
    uploadedBy: game.uploadedBy || { uid: '', name: '', email: '', role: '', active: false },
    isApproved: game.isApproved || false
  };
};

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

    return response.data.map(game => validateGame(game));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Network Error';
      throw new Error(`Failed to fetch games: ${message}`);
    }
    throw new Error('Failed to load games. Please try again later.');
  }
};
