import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Room, RoomEvent, Track } from 'livekit-client';
import { generateLiveKitToken } from '@/lib/livekit';

export default function WatchStream() {
    const { gameId } = useParams();
    const [room, setRoom] = useState<Room | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const joinStream = async () => {
            try {
                const token = await generateLiveKitToken(false, gameId!, 'viewer');
                const newRoom = new Room();
                await newRoom.connect("wss://zplay-gqa8611x.livekit.cloud", token);

                newRoom.on(RoomEvent.TrackSubscribed, (track, publication) => {
                    if (track.kind === Track.Kind.Video) {
                        const elementId = publication.trackName === 'screen'
                            ? 'screen-video'
                            : 'webcam-video';
                        const videoElement = document.getElementById(elementId);
                        if (videoElement) track.attach(videoElement as HTMLMediaElement);
                    }
                });

                setRoom(newRoom);
            } catch (err) {
                setError('Failed to connect to stream');
            }
        };

        if (gameId) {
            joinStream();
        }

        return () => {
            if (room) {
                room.disconnect();
            }
        };
    }, [gameId]);

    return (
        <div className="bg-gray-900 min-h-screen p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <video id="screen-video" className="w-full aspect-video bg-black" autoPlay />
                <video id="webcam-video" className="w-full aspect-video bg-black" autoPlay />
            </div>
            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
}
