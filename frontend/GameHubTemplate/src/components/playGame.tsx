import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { PlayGround } from "@/components/layout/PlayGround";
import PlaygroundBottomAction from "@/components/ui/playgroundBottomAction";
import { Games } from "@/api/games";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { saveGameScore } from "@/api/play";
import { getLeaderboardForGame } from "@/api/leaderboard";
import {Participant, Room, RoomEvent, Track, TrackPublication} from 'livekit-client';
import { generateLiveKitToken } from '@/lib/livekit';

const isValidUrl = (urlString: string) => {
    try {
        return Boolean(new URL(urlString));
    } catch {
        return false;
    }
};

const validateGameData = (gameData: unknown): Games => {
    if (!gameData || typeof gameData !== 'object') {
        throw new Error('Invalid game data structure');
    }

    const requiredFields = ['id', 'name', 'hostedUrl'];
    const missingFields = requiredFields.filter(field => !(field in gameData));

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const game = gameData as Games;
    if (!isValidUrl(game.hostedUrl)) {
        throw new Error('Invalid game URL format');
    }

    return game;
};

export default function PlayGame() {
    const location = useLocation();
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const [game, setGame] = useState<Games | null>(null);
    const [loading, setLoading] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [sessionKey, setSessionKey] = useState(Date.now()); // To reload iframe
    const [exitDialogOpen, setExitDialogOpen] = useState(false); // For PlaygroundBottomAction

    const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);

    const [room, setRoom] = useState<Room | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isWatching, setIsWatching] = useState(false);
    const [streamError, setStreamError] = useState('');

    // LiveKit Track Handling
    useEffect(() => {
        if (!room) return;

        const handleTrackSubscribed = (
            track: Track,
            publication: TrackPublication,
            participant: Participant
        ) => {
            const videoElement = document.getElementById('stream-video');
            if (track.kind === Track.Kind.Video && videoElement) {
                track.attach(videoElement as HTMLVideoElement);
            }
        };

        room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

        return () => {
            room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        };
    }, [room]);

    // Room Cleanup
    useEffect(() => {
        return () => {
            if (room) {
                room.disconnect();
                setRoom(null);
            }
        };
    }, [room]);

    // Streaming Handlers
    const startStreaming = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { width: 1280, height: 720 },
                audio: true
            });

            const token = await generateLiveKitToken(true, game!.id, 'streamer');
            const newRoom = new Room();

            await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!, token);
            await newRoom.localParticipant.publishTrack(stream.getVideoTracks()[0]);
            await newRoom.localParticipant.publishTrack(stream.getAudioTracks()[0]);

            setRoom(newRoom);
            setIsStreaming(true);
            setStreamError('');
        } catch (err) {
            setStreamError('Failed to start streaming');
            console.error('Streaming error:', err);
        }
    };

    const stopStreaming = async () => {
        if (room) {
            room.disconnect();
            setRoom(null);
        }
        setIsStreaming(false);
    };

    // Viewer Handler
    const watchStream = async () => {
        try {
            const token = await generateLiveKitToken(false, game!.id, 'viewer');
            const newRoom = new Room();

            await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!, token);
            setRoom(newRoom);
            setIsWatching(true);
            setStreamError('');
        } catch (err) {
            setStreamError('Failed to connect to stream');
            console.error('Viewer error:', err);
        }
    };

    const generateWatchLink = () => {
        if (!game) return '';
        return `${window.location.origin}/watch/${game.id}`;
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            console.log("Fetching leaderboard for game ID:", game?.id);
            if (!game?.id) return;
            setLeaderboardLoading(true);
            try {
                const data = await getLeaderboardForGame(game.id);
                // Transform the data structure here
                const formattedData = data.map((item: any) => ({
                    name: item.user.name,
                    score: item.totalScore
                }));
                setLeaderboard(formattedData);
            } catch (err) {
                console.error("Failed to load leaderboard:", err);
                setLeaderboard([]);
            } finally {
                setLeaderboardLoading(false);
            }
        };
        fetchLeaderboard();
    }, [game?.id]);


    useEffect(() => {
        let isMounted = true;

        const loadGame = async () => {
            try {
                if (location.state?.game) {
                    const validatedGame = validateGameData(location.state.game);
                    if (isMounted) {
                        setGame(validatedGame);
                    }
                }
            } catch (error) {
                console.error("Game validation failed:", error);
                navigate('/store', { replace: true });
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadGame();
        return () => {
            isMounted = false;
        };
    }, [location.state, navigate]);

    const saveScore = async () => {
        if (!game || currentScore <= 0) return true;

        setIsSaving(true);
        try {
            await saveGameScore(game.id, currentScore);
            return true;
        } catch (error) {
            console.error("Failed to save score:", error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleNavigationAttempt = async (to: string | number) => {
        if (gameStarted && currentScore > 0) {
            setShowExitConfirm(true);
            return false;
        }
        return true;
    };

    const confirmExit = async () => {
        const shouldExit = currentScore <= 0 || await saveScore();
        if (shouldExit) {
            navigate("/store");
            setShowExitConfirm(false);
        }
    };

    const handleQuitGame = async () => {
        const shouldQuit = currentScore <= 0 || await saveScore();
        if (shouldQuit) {
            setGameStarted(false);
            setCurrentScore(0);
            setSessionKey(Date.now()); // Force iframe reload
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (gameStarted && currentScore > 0) {
                event.preventDefault();
                event.returnValue = `Your current score is ${currentScore}. Are you sure you want to quit?`;
                return event.returnValue;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [gameStarted, currentScore]);

    useEffect(() => {
        if (navigationType === "POP" && gameStarted && currentScore > 0) {
            setShowExitConfirm(true);
            navigate(location.pathname, { replace: true });
        }
    }, [navigationType, gameStarted, currentScore]);

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gray-900 text-white items-center justify-center">
                Loading game...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-900 relative">
            <div className="h-full fixed">
                <Sidebar activeItem="store" />
            </div>

            <div className="ml-80 flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="ghost"
                        className="text-[#FFB800] hover:bg-gray-800"
                        onClick={async () => {
                            const canNavigate = await handleNavigationAttempt(-1);
                            if (canNavigate) navigate(-1);
                        }}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Store
                    </Button>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={isStreaming ? stopStreaming : startStreaming}
                            disabled={!game || isWatching}
                        >
                            {isStreaming ? 'Stop Streaming' : 'Go Live'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={watchStream}
                            disabled={!game || isStreaming}
                        >
                            Watch Stream
                        </Button>
                        {isStreaming && (
                            <Button
                                variant="outline"
                                onClick={() => navigator.clipboard.writeText(generateWatchLink())}
                            >
                                Copy Watch Link
                            </Button>
                        )}
                    </div>
                </div>

                <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
                    <DialogContent className="bg-gray-800 text-white border-gray-700">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Confirm Exit</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-300 mb-4">
                            {currentScore > 0
                                ? `Your current score is ${currentScore}. Are you sure you want to quit?`
                                : "Are you sure you want to exit?"}
                        </p>
                        <DialogFooter className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                className="border-gray-600"
                                onClick={() => setShowExitConfirm(false)}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmExit}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Confirm Exit"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <ErrorBoundary fallback={<div className="text-red-500 p-4">Game failed to load</div>}>
                    {game ? (
                        <div className="flex flex-col gap-6">
                            {/* Playground Section */}
                            <div className="bg-gray-800 rounded-lg overflow-hidden">
                                <div className="aspect-video">
                                    <PlayGround
                                        key={sessionKey}
                                        url={game.hostedUrl}
                                        onFirstInteraction={() => setGameStarted(true)}
                                    />
                                </div>

                                {/* Streaming Video Container */}
                                {(isStreaming || isWatching) && (
                                    <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                                        <video
                                            id="stream-video"
                                            className="w-full aspect-video"
                                            autoPlay
                                            controls
                                            muted={isStreaming}
                                        />
                                        {streamError && (
                                            <div className="text-red-500 p-4">{streamError}</div>
                                        )}
                                    </div>
                                )}

                                {/* Game Playground */}
                                {!isStreaming && !isWatching && (
                                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                                        <div className="aspect-video">
                                            <PlayGround
                                                key={sessionKey}
                                                url={game.hostedUrl}
                                                onFirstInteraction={() => setGameStarted(true)}
                                            />
                                        </div>
                                        <PlaygroundBottomAction
                                            gameStarted={gameStarted}
                                            gameId={game.id}
                                            currentScore={currentScore}
                                            onScoreUpdate={setCurrentScore}
                                            onExit={handleQuitGame}
                                            showDialog={exitDialogOpen}
                                            setShowDialog={setExitDialogOpen}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                                <div className="space-y-6">
                                    {/* Game Description */}
                                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                                        <h2 className="text-xl font-semibold text-[#FFB800] mb-3">About the Game</h2>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {game.description || 'No description available for this game.'}
                                        </p>
                                    </div>

                                    {/* Game Rules */}
                                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                                        <h2 className="text-xl font-semibold text-[#FFB800] mb-3">How to Play</h2>
                                        <div className="text-gray-300 text-sm space-y-2">
                                            {Array.isArray(game.rules) ? (
                                                <ul className="list-disc pl-5 space-y-2">
                                                    {game.rules.map((rule, index) => (
                                                        <li key={index}>{rule}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>{game.rules || 'No specific rules provided for this game.'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Leaderboard */}
                                <div className="bg-gray-800 p-6 rounded-lg shadow-md h-fit">
                                    <h2 className="text-xl font-semibold text-[#FFB800] mb-4">Leaderboard</h2>
                                    {leaderboardLoading ? (
                                        <p className="text-gray-400">Loading leaderboard...</p>
                                    ) : leaderboard.length > 0 ? (
                                        <div className="space-y-2">
                                            {leaderboard.map((entry, idx) => (
                                                <div key={idx} className="flex justify-between text-gray-300">
                        <span className="font-medium">
                            {idx + 1}. {entry.name || 'Anonymous'}
                        </span>
                                                    <span className="text-[#FFB800] font-bold">
                            {entry.score?.toLocaleString() || 0}
                        </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">No leaderboard data available.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <p className="text-gray-400">Game data is not available.</p>
                    )}
                </ErrorBoundary>
            </div>
        </div>
    );
}
