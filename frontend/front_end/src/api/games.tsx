import axios from 'axios';

export interface User {
    uid: string;
    email: string;
    name: string;
    role: string;
}

interface Category {
    name: string;
}


// In `front_end/src/api/games.ts`
export interface Games {
    id: string; // Change from number to string
    name: string;
    description: string;
    category: Category;
    rules: string;
    price: string;
    image: string;
    hostedUrl: string;
    active: boolean;
    uploadedBy: User;
    isApproved: boolean;
}

interface ApiGame {
    id: string;
    name: string;
    description?: string;
    category?: { name: string };
    price?: string;
    active?: boolean;
    uploadedBy?: {
        uid: string;
        email: string;
        name: string;
        role: string;
    }
    rules?: string;
    image?: string;
    hostedUrl?: string;
    isApproved?: boolean;
}

const API_URL = 'http://localhost:8080/api/v1/game';
const USER_API_URL = 'http://localhost:8080/api/v1/user';

export const saveGame = async (
    gameData: {
        name: string;
        description: string;
        category: Category;
        rules: string;
        price: string;
        image: string;
        hostedUrl: string;
        active: boolean;
        uploadedBy: User;
        isApproved: boolean;
    },
    onProgress?: (progress: number) => void
): Promise<Games> => {
    try {
        // Verify token exists
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Fetch user data
        const userResponse = await axios.get<User>(`${USER_API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            }
        });

        // Prepare complete game data
        const completeGameData = {
            ...gameData,
            uploadedBy: userResponse.data
        };

        // Send game data
        console.log("==================Complete Game Data==================");
        console.log(completeGameData);
        const response = await axios.post<Games>(`${API_URL}/add`, completeGameData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error saving game:', error);
        if (axios.isAxiosError(error)) {
            // Handle specific HTTP errors
            if (error.response?.status === 403) {
                throw new Error('Permission denied. Please check your user role.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication failed. Please login again.');
            }
        }
        throw error;
    }
};

export const loadAllGames = async (): Promise<Games[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get<ApiGame[]>(`${API_URL}/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        // Transform the data with proper typing
        console.log("loaded all games from the database : ======>",response.data); // Log all games
        // Transform the data with proper typing
        return response.data.map((game: ApiGame) => ({
            id: game.id.toString(), // Convert id to string
            name: game.name,
            description: game.description || '',
            category: game.category || { name: 'Uncategorized' },
            price: game.price || '0',
            active: game.active || false,
            uploadedBy: {
                uid: game.uploadedBy?.uid || '',
                email: game.uploadedBy?.email || '',
                name: game.uploadedBy?.name || '',
                role: game.uploadedBy?.role || ''
            },
            rules: game.rules || '', // Provide default value for rules
            image: game.image || '', // Provide default value for image
            hostedUrl: game.hostedUrl || '', // Provide default value for gitHubRepo
            isApproved: game.isApproved || false // Provide default value for isApproved
        }));
    } catch (error) {
        console.error('Error loading games:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
        }
        throw error;
    }
};

export const updateGame = async (
    gameId: string,
    gameData: {
        id: string;
        name: string;
        description: string;
        category: { name: string };
        rules: string;
        price: string;
        image: string;
        hostedUrl: string;
        active: boolean;
        uploadedBy: User;
        isApproved: boolean;
    },
    onProgress?: (progress: number) => void
): Promise<Games> => {
    try {
        // Verify token exists
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Fetch user data
        const userResponse = await axios.get<User>(`${USER_API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            }
        });

        // Prepare complete game data
        const completeGameData = {
            ...gameData,
            id: gameId, // Ensure the ID is included
            uploadedBy: userResponse.data
        };

        // Send game data
        const response = await axios.put<Games>(`${API_URL}/update`, completeGameData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error updating game:', error);
        if (axios.isAxiosError(error)) {
            // Handle specific HTTP errors
            if (error.response?.status === 403) {
                throw new Error('Permission denied. Please check your user role.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication failed. Please login again.');
            }
        }
        throw error;
    }
};

export const deactivateGame = async (gameId: string): Promise<void> => {
    try {
        // Verify token exists
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Send request to deactivate the game
        await axios.post(`${API_URL}/deactivate`, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                id: gameId
            }
        });

    } catch (error) {
        console.error('Error deactivating game:', error);
        if (axios.isAxiosError(error)) {
            // Handle specific HTTP errors
            if (error.response?.status === 403) {
                throw new Error('Permission denied. Please check your user role.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication failed. Please login again.');
            }
        }
        throw error;
    }
};
