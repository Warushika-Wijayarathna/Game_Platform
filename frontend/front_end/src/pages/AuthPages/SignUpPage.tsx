import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../../api/auth';

const SignUpForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const data = await signup(name, email, password);
            setError(data.message);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    const handleFacebookLogin = () => {
        // Replace with your backend OAuth URL
        window.location.href = 'http://localhost:8080/oauth2/authorization/facebook';
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 font-[sans-serif] h-full md:min-h-screen p-4">
            <div className="grid justify-center max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg relative">
                    <h3 className="text-3xl font-extrabold text-blue-600 text-center mb-6">Sign Up</h3>

                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none mb-4"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none mb-4"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none mb-4"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none mb-4"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-2.5 px-4 text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                        Sign Up
                    </button>

                    <p className="text-sm text-center mt-6">
                        Already have an account?
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline ml-1">
                            Sign in
                        </Link>
                    </p>

                    <hr className="my-6 border-gray-300" />

                    <div className="space-x-6 flex justify-center">
                        <button type="button" className="border-none outline-none">
                            <img
                                src="https://img.icons8.com/color/30/google-logo.png"
                                alt="Google Sign Up"
                            />
                        </button>
                        <button
                            type="button"
                            onClick={handleFacebookLogin}
                            className="border-none outline-none"
                        >
                            <img
                                src="https://img.icons8.com/ios-filled/30/facebook.png"
                                alt="Facebook Sign Up"
                            />
                        </button>
                        <button type="button" className="border-none outline-none">
                            <img
                                src="https://img.icons8.com/color/30/twitter--v1.png"
                                alt="Twitter Sign Up"
                            />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
