import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Room, Track, RemoteParticipant, RemoteTrackPublication } from 'livekit-client';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, VideoOff, Video, ScreenShare, ScreenShareOff } from 'lucide-react';
import {Games, getGameById} from '@/api/games';
import { generateLiveKitToken } from '@/lib/livekit';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { saveGameScore } from '@/api/play';
import { getLeaderboardForGame } from '@/api/leaderboard';
import ErrorBoundary from '@/components/ErrorBoundary';
import Sidebar from '@/components/layout/Sidebar';
import PlaygroundBottomAction from '@/components/ui/playgroundBottomAction';

// @ts-ignore
const LIVEKIT_URL = 'wss://zplay-gqa8611x.livekit.cloud' || 'wss://your-livekit-server-url';

export default function PlayGame() {
    const navigate = useNavigate();
    const location = useLocation();

    const [room, setRoom] = useState<Room | null>(null);
    const [game, setGame] = useState<Games | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamError, setStreamError] = useState('');
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const { gameId } = useParams<{ gameId: string }>();

    useEffect(() => {
        const loadGameData = async () => {
            try {
                if (!gameId) {
                    throw new Error("Missing game ID");
                }

                const gameData = await getGameById(gameId);
                setGame(gameData);

                const lbData = await getLeaderboardForGame(gameId!);
                setLeaderboard(lbData.map(item => ({
                    name: item.user.name,
                    score: item.totalScore
                })));

            } catch (err) {
                console.error("Game load failed:", err);
                navigate("/store"); // Redirect to store if gameId is missing
            }
        };

        loadGameData();
    }, [gameId, navigate]);




    const startStreaming = async () => {
        try {
            setStreamError('');

            // Request screen share and webcam simultaneously
            const [screenMedia, webcamMedia] = await Promise.all([
                navigator.mediaDevices.getDisplayMedia({
                    video: { width: 1920, height: 1080, frameRate: 30 },
                    audio: true
                }),
                navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720, frameRate: 30 },
                    audio: true
                })
            ]);

            setScreenStream(screenMedia);
            setWebcamStream(webcamMedia);

            // Generate unique participant ID
            const participantId = `streamer-${uuidv4()}`;
            const token = await generateLiveKitToken(true, gameId!, 'streamer'); // Pass all required arguments

            const newRoom = new Room({
                publishDefaults: {
                    screenShareEncoding: {
                        maxBitrate: 3_000_000,
                        maxFramerate: 30
                    }
                }
            });

            // Connect to LiveKit
            await newRoom.connect(LIVEKIT_URL, token);

            // Publish screen share track
            await newRoom.localParticipant.publishTrack(screenMedia.getVideoTracks()[0], {
                name: 'screen',
                source: Track.Source.ScreenShare,
                simulcast: false
            });

            // Publish webcam track
            await newRoom.localParticipant.publishTrack(webcamMedia.getVideoTracks()[0], {
                name: 'webcam',
                source: Track.Source.Camera,
                simulcast: true
            });

            // Publish audio from webcam
            await newRoom.localParticipant.publishTrack(webcamMedia.getAudioTracks()[0]);

            // Handle remote participants (viewers)
            newRoom.on('participantConnected', (participant) => {
                console.log('Viewer connected:', participant.identity);
            });

            setRoom(newRoom);
            setIsStreaming(true);
        } catch (err) {
            console.error('Streaming error:', err);
            setStreamError('Failed to start streaming. Please check permissions.');
            stopStreaming();
        }
    };

    const stopStreaming = async () => {
        if (room) {
            room.disconnect();
            setRoom(null);
        }
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
        }
        if (webcamStream) {
            webcamStream.getTracks().forEach(track => track.stop());
            setWebcamStream(null);
        }
        setIsStreaming(false);
    };

    const copyWatchLink = () => {
        navigator.clipboard.writeText(
            `${window.location.origin}/watch/${gameId}`
        );
    };

    const handleExit = async () => {
        await stopStreaming();
        navigate('/store');
    };

    return (
        <div className="min-h-screen flex bg-gray-900">
            <Sidebar activeItem="store" />

            <div className="flex-1 p-8 ml-72">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4">
                        {isStreaming ? (
                            <Button onClick={stopStreaming} variant="destructive">
                                <ScreenShareOff className="mr-2" />
                                Stop Streaming
                            </Button>
                        ) : (
                            <Button onClick={startStreaming}>
                                <ScreenShare className="mr-2" />
                                Go Live
                            </Button>
                        )}

                        {isStreaming && (
                            <Button onClick={copyWatchLink}>
                                <Copy className="mr-2" />
                                Copy Watch Link
                            </Button>
                        )}
                    </div>
                </div>

                {streamError && (
                    <div className="text-red-500 mb-4 p-3 bg-red-900 rounded">
                        {streamError}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    {/* Screen Share Preview */}
                    {screenStream && (
                        <div className="relative">
                            <video
                                ref={(el) => {
                                    if (el) el.srcObject = screenStream;
                                }}
                                autoPlay
                                muted
                                className="w-full h-auto rounded-lg shadow-xl border-2 border-blue-400"
                            />
                            <div className="absolute bottom-2 left-2 bg-blue-600 text-xs px-2 py-1 rounded">
                                Screen Share
                            </div>
                        </div>
                    )}

                    {/* Webcam Preview */}
                    {webcamStream && (
                        <div className="relative">
                            <video
                                ref={(el) => {
                                    if (el) el.srcObject = webcamStream;
                                }}
                                autoPlay
                                muted
                                className="w-full h-auto rounded-lg shadow-xl border-2 border-green-400"
                            />
                            <div className="absolute bottom-2 left-2 bg-green-600 text-xs px-2 py-1 rounded">
                                Webcam
                            </div>
                        </div>
                    )}
                </div>

                <ErrorBoundary fallback={<div className="text-red-500">Something went wrong. Please try again later.</div>}>
                <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                    {game?.hostedUrl && (
                        <>
                            <iframe
                                src={game.hostedUrl}
                                className="w-full h-full"
                                title="Game Playground"
                                allow="autoplay; fullscreen"
                            />
                            {!gameStarted && (
                                <div
                                    className="absolute inset-0"
                                    onClick={() => {
                                        console.log("Overlay clicked");
                                        setGameStarted(true);
                                    }}
                                ></div>
                            )}
                        </>
                    )}
                </div>

                    <PlaygroundBottomAction
                        gameStarted={gameStarted}
                        gameId={gameId!}
                        currentScore={currentScore}
                        onScoreUpdate={setCurrentScore}
                        onExit={async () => {
                            setShowDialog(true);
                            navigate('/store');
                        }}
                        showDialog={showDialog}
                        setShowDialog={setShowDialog}                   />

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Game Details</h2>
                            <div className="space-y-2">
                                <p><strong>Name:</strong> {game?.name}</p>
                                <p><strong>Description:</strong> {game?.description}</p>
                                <p><strong>Rules:</strong> {game?.rules}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
                            <div className="space-y-2">
                                {leaderboard.map((entry, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>{entry.name}</span>
                                        <span>{entry.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ErrorBoundary>

                {/* Exit Confirmation Dialog */}
                <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Exit</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-300">
                            Are you sure you want to stop streaming and exit the game?
                        </p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowExitConfirm(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleExit}>
                                Confirm Exit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
