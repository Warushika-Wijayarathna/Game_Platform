import { FormEvent, useState } from "react";
import { login } from "../../api/auth.tsx";
import { Link } from "react-router-dom";


const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        try {
            await login(email, password);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 font-[sans-serif] min-h-screen p-4">
            <div className="grid justify-center max-w-md mx-auto">
                <div>
                    <img
                        src="https://readymadeui.com/login-image.webp"
                        className="w-full object-cover rounded-2xl"
                        alt="Login Illustration"
                    />
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl p-6 -mt-24 relative z-10 shadow-lg"
                >
                    <h3 className="text-3xl font-extrabold text-blue-600 mb-6">Sign in</h3>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    {/* Email Input */}
                    <div className="mb-6">
                        <label htmlFor="email" className="text-gray-800 text-sm font-medium">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label htmlFor="password" className="text-gray-800 text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="text-gray-800 ml-3 text-sm">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" className="text-blue-600 text-sm font-semibold hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 px-4 text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition duration-200"
                    >
                        Sign in
                    </button>

                    {/* Sign Up Link */}
                    <p className="text-sm text-center mt-6">
                        Don’t have an account?
                        <Link to="/signup" className="text-blue-600 font-semibold hover:underline ml-1">
                            Register here
                        </Link>
                    </p>

                    {/* Social Media Login */}
                    <hr className="my-6 border-gray-300" />
                    <div className="space-x-6 flex justify-center">
                        <button type="button" className="border-none outline-none">
                            <img src="https://img.icons8.com/color/30/google-logo.png" alt="Google Sign Up" />
                        </button>
                        <button type="button" className="border-none outline-none">
                            <img src="https://img.icons8.com/ios-filled/30/facebook.png" alt="Facebook Sign Up" />
                        </button>
                        <button type="button" className="border-none outline-none">
                            <img src="https://img.icons8.com/color/30/twitter--v1.png" alt="Twitter Sign Up" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
