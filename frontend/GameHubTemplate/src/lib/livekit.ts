import { AccessToken } from 'livekit-server-sdk';

export const generateLiveKitToken = async (canPublish: boolean, roomName: string, identity: string) => {
    const apiKey = import.meta.env.NEXT_PUBLIC_LIVEKIT_API_KEY;
    const apiSecret = import.meta.env.NEXT_PUBLIC_LIVEKIT_API_SECRET;

    console.log("................................,,,,,,,,,,,,,,.>>>>>>>>>>>>>>>>.apiKey", apiKey);
    console.log("apiSecret", apiSecret);

    if (!apiKey || !apiSecret) {
        throw new Error('LiveKit API credentials not configured');
    }

    const token = new AccessToken(apiKey, apiSecret, {
        identity,
        name: identity,
    });

    // Add unique viewer identifiers
    token.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: false,
        canSubscribe: true,
        canPublishData: true,
        roomAdmin: false,
    });

    return token.toJwt();
};
