
import type { NextApiRequest, NextApiResponse } from 'next';
import { AccessToken } from 'livekit-server-sdk';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { roomName, identity, canPublish } = req.body;

    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;

    if (!apiKey || !apiSecret) {
        return res.status(500).json({ error: 'LiveKit credentials not configured' });
    }

    const token = new AccessToken(apiKey, apiSecret, {
        identity,
        name: identity,
    });

    token.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish,
        canSubscribe: true,
        canPublishData: true,
    });

    res.status(200).json({ token: token.toJwt() });
}
