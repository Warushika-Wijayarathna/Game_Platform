import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {sendTokenToOtherDomains} from "../../api/auth.tsx";

export function GoogleSignBtn() {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);

            try {
                // Get user info from Google using the access token
                const userInfoResponse = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`
                        }
                    }
                );

                // Send the user data to your backend
                const res = await axios.post("http://localhost:8080/api/v1/auth/google", {
                    token: tokenResponse.access_token,
                    email: userInfoResponse.data.email,
                    name: userInfoResponse.data.name
                });

                // Store the JWT token returned from your backend
                if (res.data && res.data.data) {
                    // Make sure the backend includes the token in the response
                    localStorage.setItem("token", res.data.data.token || "");
                    console.log("Logged in successfully!");


                    // Optionally, you can also store user info in local storage
                    localStorage.setItem("token", JSON.stringify(res.data.data.token));

                    await sendTokenToOtherDomains(localStorage.getItem("token") || "");

                    // Redirect to another page after successful login
                    window.location.href = 'http://localhost:5174/';

                }
            } catch (error) {
                console.error("Google login failed:", error);
            }
        },
        onError: (error) => {
            console.log("Google login error:", error);
        },
        // Use auth code flow to get both access and ID tokens
        flow: "implicit",
        scope: "email profile openid",
    });

    return (
        <button
            onClick={() => login()}
            type="button"
            className="border-none outline-none"
        >
            <img
                src="https://img.icons8.com/color/30/google-logo.png"
                alt="Google Sign Up"
            />
        </button>
    );
}
