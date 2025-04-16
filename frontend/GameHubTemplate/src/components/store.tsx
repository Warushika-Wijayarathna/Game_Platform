import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { fetchAllGames, Games } from "../api/games";
import ErrorBoundary from "../components/ErrorBoundary";
import DailyRewards from "@/components/rewards/DailyRewards.tsx";
import ChatUi from "@/components/chat/chatUi.tsx";

export default function Store() {
    const navigate = useNavigate();
    const [games, setGames] = useState<Games[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState<"home" | "rewards" | "store" | "profile">(
        "store",
    );

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeDonorId, setActiveDonorId] = useState<number | null>(null);

    function handleChatOpen(s: string) {
        setActiveDonorId(1);
        setIsChatOpen(true);
    }
    const handleChatClose = () => {
        setIsChatOpen(false);
        setActiveDonorId(null);
    };

    const handleMenuClick = (menuItem: string) => {
        if (menuItem === "rewards") {
            setActiveSection("rewards");
        } else if (menuItem === "home") {
            setActiveSection("home");
        } else if (menuItem === "store") {
            setActiveSection("store");
        } else if (menuItem === "profile") {
            setActiveSection("profile");
        }
    };

    useEffect(() => {
        const loadGames = async () => {
            try {
                const data = await fetchAllGames();
                setGames(data);
                setError("");
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load games");
            } finally {
                setLoading(false);
            }
        };
        loadGames();
    }, []);

    const categories = Array.from(new Set(games.map(game => game.category))).filter(Boolean) as string[];

    const handlePlayClick = (game: Games) => {
        navigate("/playGame", { state: { game } });
    };

    const GameCard = ({ game }: { game: Games }) => (
        <Card className="bg-gray-800 text-white border-gray-700 hover:border-[#FFB800] transition-colors">
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={game.image || '/fallback-game.png'}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/fallback-game.png';
                    }}
                />
            </div>
            <CardHeader>
                <CardTitle className="text-xl">{game.name}</CardTitle>
                <CardDescription className="text-gray-400 line-clamp-3">
                    {game.description || 'No description available'}
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
                {/*<span className="text-[#FFB800] font-bold">{game.price || 'Free'}</span>*/}
                <Button
                    className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black"
                    onClick={() => handlePlayClick(game)}
                >
                    <FontAwesomeIcon icon={faPlay} />&nbsp;&nbsp;Play Now
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <ErrorBoundary fallback={<div className="text-red-500 p-4">Store component failed to load</div>}>
            <div className="min-h-screen flex bg-gray-900">
                <div className="h-full fixed">
                    <Sidebar activeItem={activeSection} onMenuClick={handleMenuClick}/>
                </div>
                <div className="ml-80 flex-1 p-8">
                    {loading ? (
                        <div className="text-white text-center">Loading games...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center">{error}</div>
                    ) : activeSection === "store" ? (
                        <main className="max-w-7xl mx-auto">
                            <h1 className="text-3xl font-bold text-white mb-8">Game Store</h1>
                            {categories.map((category) => (
                                <section key={category} className="mb-12">
                                    <h2 className="text-2xl font-bold text-white mb-6">{category}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {games
                                            .filter(game => game.category === category)
                                            .map(game => (
                                                <GameCard key={game.id} game={game}/>
                                            ))}
                                    </div>
                                </section>
                            ))}
                        </main>
                    ) : (
                        <DailyRewards/>
                    )}
                </div>
                <button

                    onClick={handleChatOpen}
                    className="px-3 py-2 text-sm font-medium text-white bg-yellow-400 rounded hover:bg-yellow-600 absolute right-2.5 bottom-10"
                >
                    Chat
                </button>

                {isChatOpen && (
                    <ChatUi
                        donorId={activeDonorId}
                        onClose={handleChatClose}
                    />
                )}

            </div>
        </ErrorBoundary>
    );
}
