import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { fetchAllGames, Games, User } from "../api/games";
import ErrorBoundary from "../components/ErrorBoundary";
import DailyRewards from "@/components/rewards/DailyRewards.tsx";
import Chat from "@/components/chat/Chat.tsx";

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

    function handleChatOpen(event: React.MouseEvent<HTMLButtonElement>) {
        setActiveDonorId(1);
        setIsChatOpen(true);
    }

    const handleChatClose = () => {
        setIsChatOpen(false);
        setActiveDonorId(null);
    };

    const handleMenuClick = (menuItem: string) => {
        setActiveSection(menuItem as "home" | "rewards" | "store" | "profile");
    };

    useEffect(() => {
        const loadGames = async () => {
            try {
                const data = await fetchAllGames();
                const filteredGames = data.filter(game =>
                    game.isApproved && game.active && game.hostedUrl
                );
                setGames(filteredGames);
                setError("");
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load games");
            } finally {
                setLoading(false);
            }
        };
        loadGames();
    }, []);

    const categories = Array.from(
        new Set(games.map(game => game.category?.name || 'Uncategorized'))
    ).filter(Boolean) as string[];

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
                {/* Lock overlay */}
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
                            {categories.map(category => (
                                <section key={category} className="mb-12">
                                    <h2 className="text-2xl font-bold text-white mb-6">
                                        {category}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {games
                                            .filter(game => game.category?.name === category)
                                            .map(game => (
                                                <GameCard key={game.id} game={game} />
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
                    <Chat/>
                )}
            </div>
        </ErrorBoundary>
    );
}
