import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Apple, PlayCircle } from "lucide-react";
import DailyRewards from "./rewards/DailyRewards.tsx";
import Profile from "@/components/profile.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleUser, faPlay, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import { fetchAllGames, Games } from "../api/games";
import { useNavigate } from "react-router-dom";
import {getTopScorers} from "@/api/user.tsx";

interface TopPlayers {
  name: string;
  total_score: number;
}

const topScorers = await getTopScorers();

console.log("topScorers", topScorers);

const topPlayers: TopPlayers[] = topScorers.map((scorer) => ({
  name: scorer.name,
  total_score: scorer.total_score,
}));

export default function Home() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Games[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"home" | "rewards" | "store" | "profile">("home");

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchAllGames();
        const filteredGames = data.filter(game =>
            game.isApproved && game.active && game.hostedUrl
        );
        setGames(filteredGames.slice(0, 2)); // Take first 2 approved games
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  const handlePlayClick = (game: Games) => {
    const isRacing = game.category?.name.toLowerCase() === 'race';
    const points = parseInt(localStorage.getItem('existingPoints') || '0', 10);

    if (isRacing && points < 250) {
      alert('You need at least 250 points to play racing games!');
      return;
    }
    navigate(`/playGame/${game.id}`);
  };

  const GameCard = ({ game }: { game: Games }) => {
    const [imgError, setImgError] = useState(false);
    const [points] = useState(() => {
      const storedPoints = localStorage.getItem('existingPoints');
      return parseInt(storedPoints || '0', 10);
    });

    const isRacingGame = game.category?.name.toLowerCase() === 'race';
    const canPlayRacing = points >= 250;
    const isLocked = isRacingGame && !canPlayRacing;

    return (
        <Card className="bg-gray-800 text-white border-gray-700 hover:border-[#FFB800] transition-colors relative">
          {isLocked && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-10">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">
                    🔒 Locked
                  </div>
                  <p className="text-gray-200">
                    Requires 250 points<br />
                    Current points: {points}
                  </p>
                </div>
              </div>
          )}

          <div className="aspect-video relative overflow-hidden">
            {imgError ? (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm">Image not available</span>
                </div>
            ) : (
                <img
                    src={game.image || '/fallback-game.png'}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-xl">{game.name}</CardTitle>
            <CardDescription className="text-gray-400 line-clamp-3">
              {game.description || 'No description available'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between items-center">
            <div className="text-lg font-semibold text-yellow-400">
              {game.price ? `$${game.price}` : 'Free'}
            </div>
            <Button
                className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black relative"
                onClick={() => handlePlayClick(game)}
                disabled={!game.hostedUrl || isLocked}
            >
              <FontAwesomeIcon icon={faPlay} />&nbsp;&nbsp;
              {!game.hostedUrl ? 'Coming Soon' :
                  isLocked ? 'Need 250 Points' : 'Play Now'}
            </Button>
          </CardFooter>
        </Card>
    );
  };

  const handleMenuClick = (menuItem: string) => {
    setActiveSection(menuItem as "home" | "rewards" | "store" | "profile");
  };

  return (
      <div className="min-h-screen flex bg-gray-900">
        <div className="h-full fixed">
          <Sidebar activeItem={activeSection} onMenuClick={handleMenuClick} />
        </div>

        <div className="ml-80 w-full">
          <main className="flex-1 p-6">
            {activeSection === "home" ? (
                <>
                  <section className="relative h-[400px] rounded-lg overflow-hidden mb-8">
                    <img
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
                        alt="Hero Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                      <h1 className="text-4xl font-bold text-white mb-4">Welcome to Z-Play</h1>
                      <p className="text-lg text-white/90 mb-6">
                        A Z-Play for every player to engage more fun
                      </p>
                      <div className="flex gap-4">
                        <Button
                          className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black"
                          onClick={() => window.location.href = "http://localhost:5173"}
                        >
                          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                          Sign Up
                        </Button>
                        <Button
                          className="hover:bg-[#FFB800]/90 text-black"
                          onClick={() => navigate("/store")}
                        >
                          <PlayCircle className="mr-2 h-5 w-5" />
                          View Games
                        </Button>
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                    <div className="space-y-8">
                      <section>
                        <h2 className="text-2xl font-bold text-white mb-6">Featured Games</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {loading ? (
                              <div className="text-white">Loading games...</div>
                          ) : error ? (
                              <div className="text-red-500">{error}</div>
                          ) : (
                              games.map((game) => (
                                  <GameCard key={game.id} game={game} />
                              ))
                          )}
                        </div>
                      </section>
                    </div>

                    <aside className="space-y-6">
                      <h2 className="text-2xl font-bold text-white">Top Players</h2>
                      {topPlayers.map((player) => (
                          <Card className="bg-gray-800 text-white border-gray-700">
                            <CardHeader>
                              <CardTitle className="text-lg">{player.name}</CardTitle>
                              <CardDescription className="text-gray-400">
                                {player.total_score}⭐
                              </CardDescription>
                            </CardHeader>
                          </Card>
                      ))}
                    </aside>
                  </div>
                </>
            ) : activeSection === "rewards" ? (
                <DailyRewards />
            ) : activeSection === "profile" ? (
                <Profile />
            ) : null}
          </main>
        </div>
      </div>
  );
}
