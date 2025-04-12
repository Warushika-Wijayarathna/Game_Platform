import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home.tsx";
import Store from "./components/store.tsx";
import DailyRewards from "./components/rewards/DailyRewards.tsx";
import routes from "tempo-routes";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import PlayGame from "./components/playGame.tsx";


function App() {
  return (
    <TooltipProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/rewards" element={<DailyRewards />} />
            <Route path="/playGame" element={<PlayGame />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </TooltipProvider>
  );
}

export default App;
