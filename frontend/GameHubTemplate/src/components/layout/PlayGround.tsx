import React, { useRef } from "react";

interface PlayGroundProps {
    url?: string;
    onFirstInteraction?: () => void;
}

export function PlayGround({ url, onFirstInteraction }: PlayGroundProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleOverlayClick = () => {
        if (onFirstInteraction) {
            onFirstInteraction();
            if (overlayRef.current) {
                overlayRef.current.style.display = 'none';
            }
        }
    };

    return (
        <div className="h-full w-full bg-gray-900 relative">
            <div
                ref={overlayRef}
                onClick={handleOverlayClick}
                className="absolute inset-0 z-10 cursor-pointer"
                style={{ backgroundColor: 'transparent' }}
                aria-hidden="true"
            />
            <iframe
                ref={iframeRef}
                src={url}
                title="Game Preview"
                allow="fullscreen"
                loading="eager"
                className="w-full h-full border-0 bg-white relative z-0"
                referrerPolicy="strict-origin"
            />
        </div>
    );
}
