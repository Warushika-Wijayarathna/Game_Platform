import {Suspense, useEffect} from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home.tsx";
import Store from "./components/store.tsx";
import DailyRewards from "./components/rewards/DailyRewards.tsx";
import routes from "tempo-routes";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import PlayGame from "./components/playGame.tsx";
import WatchStream from "@/components/WatchStream.tsx";
import Profile from "./components/profile.tsx";

function App() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "http://localhost:5173") {
        const { token } = event.data;
        if (token) {
          localStorage.setItem("token", token);
          console.log("Token stored in 5174:", token);
          window.location.href = "/admin-home";
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  return (
    <TooltipProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/rewards" element={<DailyRewards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/playGame" element={<PlayGame />} />
            <Route path="/watch/:gameId" element={<WatchStream />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </TooltipProvider>
  );
}

export default App;
