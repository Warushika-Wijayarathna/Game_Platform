import $ from 'jquery';

interface AuthResponse {
    code: bigint;
    message: string;
    data: {
        email: string;
        token: string;
    }
}

const sendTokenToOtherDomains = (token: string) => {
    const targetOrigin = 'http://localhost:5174';

    return new Promise<void>((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `${targetOrigin}/token-receiver.html`;
        document.body.appendChild(iframe);

        const cleanup = () => {
            document.body.removeChild(iframe);
            window.removeEventListener('message', confirmationListener);
        };

        const confirmationListener = (event: MessageEvent) => {
            if (event.origin === targetOrigin && event.data.type === 'TOKEN_CONFIRMED') {
                cleanup();
                resolve();
            }
        };

        window.addEventListener('message', confirmationListener);

        iframe.onload = () => {
            iframe.contentWindow?.postMessage(
                {
                    type: 'SET_TOKEN',
                    token,
                    timestamp: Date.now()
                },
                targetOrigin
            );

            // Fallback timeout
            setTimeout(() => {
                cleanup();
                resolve();
            }, 3000);
        };
    });
};

export const login = (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:8080/api/v1/auth/authenticate',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: async (response: AuthResponse) => {
                console.log('Login response:', response);
                const token = response.data.token;

                // Store token in localStorage for the current domain
                localStorage.setItem('token', token);

                // Send token to other domains
                await sendTokenToOtherDomains(response.data.token);

                resolve(response);

                if (email.endsWith('@zplay.com')) {
                    window.location.href = '/admin-home';
                } else {
                    window.location.href = 'http://localhost:5174/';
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
            success: async (response: AuthResponse) => {
                console.log('Signup response:', response);
                const token = response.data.token;

                // Store token in localStorage for the current domain
                localStorage.setItem('token', token);

                // Send token to other domains
                await sendTokenToOtherDomains(response.data.token);

                resolve(response);

                if (email.endsWith('@zplay.com')) {
                    window.location.href = '/admin-home';
                } else {
                    window.location.href = 'http://localhost:5174/';
                }
            },
            error: (xhr, _status, error) => {
                console.error('Signup error:', xhr.responseText || error);
                reject(new Error(xhr.responseText || 'Signup failed. Please try again.'));
            }
        });
    });
};
