import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <GoogleOAuthProvider clientId="265222903570-ek74d4orunrppng6q78h7j0dn3fek05h.apps.googleusercontent.com"> {/* 👈 wrap */}
          <ThemeProvider>
              <AppWrapper>
                  <App />
              </AppWrapper>
          </ThemeProvider>
      </GoogleOAuthProvider>
  </StrictMode>
);
