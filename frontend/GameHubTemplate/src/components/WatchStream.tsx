import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Room } from 'livekit-client';
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
                await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!, token);
                setRoom(newRoom);
            } catch (err) {
                setError('Failed to connect to stream');
            }
        };

        if (gameId) joinStream();

        return () => {
            room?.disconnect();
        };
    }, [gameId]);

    return (
        <div className="bg-gray-900 min-h-screen p-8">
            <video
                id="stream-video"
                className="w-full aspect-video bg-black"
                autoPlay
                controls
            />
            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
}
