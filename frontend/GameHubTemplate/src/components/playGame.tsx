import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { PlayGround } from "@/components/layout/PlayGround";
import PlaygroundBottomAction from "@/components/ui/playgroundBottomAction";
import { Games } from "@/api/games";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { saveGameScore } from "@/api/play";
import { getLeaderboardForGame } from "@/api/leaderboard";
import {
    Participant,
    Room,
    RoomEvent,
    Track,
    TrackPublication,
} from "livekit-client";
import { generateLiveKitToken } from "@/lib/livekit";

const isValidUrl = (urlString: string) => {
    try {
        return Boolean(new URL(urlString));
    } catch {
        return false;
    }
};

const validateGameData = (gameData: unknown): Games => {
    if (!gameData || typeof gameData !== "object") {
        throw new Error("Invalid game data structure");
    }

    const requiredFields = ["id", "name", "hostedUrl"];
    const missingFields = requiredFields.filter(
        (field) => !(field in gameData)
    );

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const game = gameData as Games;
    if (!isValidUrl(game.hostedUrl)) {
        throw new Error("Invalid game URL format");
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
    const [sessionKey, setSessionKey] = useState(Date.now());
    const [exitDialogOpen, setExitDialogOpen] = useState(false);
    const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);

    const [room, setRoom] = useState<Room | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isWatching, setIsWatching] = useState(false);
    const [streamError, setStreamError] = useState("");

    const liveKitUrl = "wss://zplay-gqa8611x.livekit.cloud";

    useEffect(() => {
        if (!room) return;

        const handleTrackSubscribed = (
            track: Track,
            publication: TrackPublication,
            participant: Participant
        ) => {
            debugger; // Pause here to inspect the track details
            console.log("Track received:", track);

            if (track.kind === "video") {
                const videoElement = document.getElementById("stream-video") as HTMLVideoElement;
                if (videoElement) {
                    console.log("Attaching track to video element:", videoElement);
                    track.attach(videoElement);
                    videoElement.play(); // Make sure the video starts playing
                    console.log("Video element play triggered");
                } else {
                    console.warn("No video element found with id 'stream-video'");
                }
            }
        };

        room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

        // Clean up
        return () => {
            room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        };
    }, [room]);


    useEffect(() => {
        return () => {
            if (room) {
                room.disconnect();
                setRoom(null);
            }
        };
    }, []);

    const startStreaming = async () => {
        try {
            alert("When prompted, please select the browser tab or window that displays the game.");
            console.log("▶ Starting screen capture...");

            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { width: 1280, height: 720 },
                audio: true,
            });

            console.log("✅ Screen capture stream obtained:", stream);
            console.log("Tracks:", stream.getTracks());
            console.log("Video Tracks:", stream.getVideoTracks());
            console.log("Audio Tracks:", stream.getAudioTracks());

            const videoTracks = stream.getVideoTracks();
            const audioTracks = stream.getAudioTracks();

            if (videoTracks.length === 0) {
                console.error("❌ No video track found in stream.");
                throw new Error("No video track available for streaming.");
            }

            const videoTrack = videoTracks[0];
            const audioTrack = audioTracks[0];

            console.log("🎥 Video track readyState:", videoTrack.readyState);
            console.log("🎧 Audio track readyState:", audioTrack?.readyState);
            console.log("🔄 Stream active:", stream.active);

            const token = await generateLiveKitToken(true, game!.id, "streamer");
            console.log("🔐 LiveKit Token:", token);
            console.log("🌐 LiveKit URL:", liveKitUrl);

            const newRoom = new Room();

            newRoom.on(RoomEvent.Disconnected, (reason) => {
                console.warn("⚠️ Disconnected from room:", reason);
                setStreamError(`Disconnected: ${reason}`);
            });

            newRoom.on(RoomEvent.ConnectionStateChanged, (state) => {
                console.log("🔄 Room connection state:", state);
            });

            console.log("🔌 Connecting to LiveKit...");
            await newRoom.connect(liveKitUrl, token);
            console.log("✅ Connected to room:", newRoom.name);

            console.log("📡 Publishing video track...");
            await newRoom.localParticipant.publishTrack(videoTrack);

            if (audioTrack) {
                console.log("🔊 Publishing audio track...");
                await newRoom.localParticipant.publishTrack(audioTrack);
            } else {
                console.warn("⚠️ No audio track selected, continuing with video only.");
            }

            console.log("✅ Streaming started.");
            setRoom(newRoom);
            setIsStreaming(true);
            setStreamError("");
        } catch (err) {
            setStreamError("Failed to start streaming");
            console.error("❌ Streaming error:", err);
            debugger;
        }
    };

    const stopStreaming = async () => {
        if (room) {
            room.localParticipant.trackPublications.forEach((pub) => pub.track?.stop());
            await room.disconnect();
            setRoom(null);
        }
        setIsStreaming(false);
    };

    const watchStream = async () => {
        if (!liveKitUrl || !game) {
            setStreamError("LiveKit config or game data missing.");
            return;
        }

        try {
            const token = await generateLiveKitToken(false, game.id, "viewer");
            const newRoom = new Room();
            await newRoom.connect(liveKitUrl, token);
            setRoom(newRoom);
            setIsWatching(true);
            setStreamError("");
        } catch (err) {
            console.error("Viewer error:", err);
            setStreamError("Failed to connect to stream.");
        }
    };

    const generateWatchLink = () =>
        game ? `${window.location.origin}/watch/${game.id}` : "";

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!game?.id) return;
            setLeaderboardLoading(true);
            try {
                const data = await getLeaderboardForGame(game.id);
                const formattedData = data.map((item: any) => ({
                    name: item.user.name,
                    score: item.totalScore,
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
        const loadGame = async () => {
            try {
                if (location.state?.game) {
                    const validated = validateGameData(location.state.game);
                    setGame(validated);
                }
            } catch (err) {
                console.error("Game load failed:", err);
                navigate("/store", { replace: true });
            } finally {
                setLoading(false);
            }
        };
        loadGame();
    }, [location.state, navigate]);

    const saveScore = async () => {
        if (!game || currentScore <= 0) return true;
        setIsSaving(true);
        try {
            await saveGameScore(game.id, currentScore);
            return true;
        } catch (err) {
            console.error("Save score failed:", err);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuitGame = async () => {
        const shouldQuit = currentScore <= 0 || (await saveScore());
        if (shouldQuit) {
            setGameStarted(false);
            setCurrentScore(0);
            setSessionKey(Date.now());
        }
    };

    const confirmExit = async () => {
        const shouldExit = currentScore <= 0 || (await saveScore());
        if (shouldExit) {
            navigate("/store");
            setShowExitConfirm(false);
        }
    };

    const handleNavigationAttempt = async () => {
        if (gameStarted && currentScore > 0) {
            setShowExitConfirm(true);
            return false;
        }
        return true;
    };

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (gameStarted && currentScore > 0) {
                e.preventDefault();
                e.returnValue = "";
                return "";
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
    }, [navigationType]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
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
                    <Button variant="ghost" onClick={async () => {
                        const canLeave = await handleNavigationAttempt();
                        if (canLeave) navigate(-1);
                    }}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Store
                    </Button>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={isStreaming ? stopStreaming : startStreaming}
                            disabled={!game || isWatching}
                        >
                            {isStreaming ? "Stop Streaming" : "Go Live"}
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
                                onClick={() =>
                                    navigator.clipboard.writeText(generateWatchLink())
                                }
                            >
                                Copy Watch Link
                            </Button>
                        )}
                    </div>
                </div>

                <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Exit</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-300">
                            {currentScore > 0
                                ? `Your current score is ${currentScore}. Are you sure you want to quit?`
                                : "Are you sure you want to exit the game?"}
                        </p>
                        <DialogFooter>
                            <Button onClick={() => setShowExitConfirm(false)} variant="ghost">
                                Cancel
                            </Button>
                            <Button onClick={confirmExit}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <ErrorBoundary fallback={<div>Something went wrong.</div>}>
                    <div className="aspect-video relative">
                        {(isStreaming || isWatching) ? (
                            <>
                                <video
                                    id="stream-video"
                                    className="w-full aspect-video pointer-events-none"
                                    autoPlay
                                    muted={isStreaming} // Muted if streaming, otherwise, let viewers hear
                                    playsInline
                                    onLoadedData={() => {
                                        debugger; // Pause when the video is loaded
                                        console.log("Video element loaded and ready for playback.");
                                    }}
                                />

                                {streamError && <div className="text-red-500 p-4">{streamError}</div>}
                            </>
                        ) : (
                            <PlayGround
                                key={sessionKey}
                                url={game.hostedUrl}
                                onFirstInteraction={() => setGameStarted(true)}
                            />
                        )}

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
                    <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
                        <div className="space-y-4">
                            <div className="text-xl font-semibold text-white">Game Description</div>
                            <div className="text-gray-300">{game?.description || "No description available."}</div>
                            <div className="text-xl font-semibold text-white">Game Rules</div>
                            <div className="text-gray-300">{game?.rules || "No rules available."}</div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-xl font-semibold text-white">Leaderboard</div>
                            {leaderboardLoading ? (
                                <div className="text-gray-400">Loading leaderboard...</div>
                            ) : (
                                <div className="space-y-2">
                                    {leaderboard.map((entry) => (
                                        <div key={entry.name} className="flex justify-between">
                                            <div className="text-white">{entry.name}</div>
                                            <div className="text-white">{entry.score}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </ErrorBoundary>
            </div>
        </div>
    );
}
