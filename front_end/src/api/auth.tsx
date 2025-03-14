import $ from 'jquery';

interface AuthResponse {
    message: string;
    token: string;
}

export const login = (email: string, password: string, onSuccess?: () => void): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:8080/api/v1/user/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: (response: AuthResponse) => {
                console.log('Login response:', response);
                localStorage.setItem('token', response.token);
                resolve(response);

                if (onSuccess) {
                    onSuccess();
                }
            },
            error: (xhr, _status, error) => {
                console.error('Login error:', xhr.responseText || error);
                reject(new Error(xhr.responseText || 'Login failed. Please try again.'));
            }
        });
    });
};

export const signup = (name: string, email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:8080/api/v1/user/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name, email, password }),
            success: (response: AuthResponse) => {
                console.log('Signup response:', response);
                localStorage.setItem('token', response.token);
                resolve(response);
            },
            error: (xhr, _status, error) => {
                console.error('Signup error:', xhr.responseText || error);
                reject(new Error(xhr.responseText || 'Signup failed. Please try again.'));
            }
        });
    });
};
