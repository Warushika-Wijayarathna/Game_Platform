import axios from "axios";

export interface Users {
    uid: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
}

const USER_API_URL = 'http://localhost:8080/api/v1/user';

// get user
export async function getUser() {
    try {
        const response = await axios.get(`${USER_API_URL}/get`);
        console.log('Response: User', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function loadAllUsers() {
    try {
        const response = await axios.get(`${USER_API_URL}/getAll`);
        console.log('Response: Users', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const deactivateUser = (userId: string | number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${USER_API_URL}/deactivate`;
        const token = localStorage.getItem("token");

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    console.error("HTTP error! Status:", xhr.status);
                    reject(new Error(`HTTP error! Status: ${xhr.status}`));
                }
            }
        };

        xhr.onerror = () => {
            console.error("Network error occurred");
            reject(new Error("Network error occurred"));
        };

        xhr.send(JSON.stringify(userId));
    });
};

export const activateUser = (userId: string | number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${USER_API_URL}/activate`;
        const token = localStorage.getItem("token");

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    console.error("HTTP error! Status:", xhr.status);
                    reject(new Error(`HTTP error! Status: ${xhr.status}`));
                }
            }
        };

        xhr.onerror = () => {
            console.error("Network error occurred");
            reject(new Error("Network error occurred"));
        };

        xhr.send(JSON.stringify(userId));
    });
};
