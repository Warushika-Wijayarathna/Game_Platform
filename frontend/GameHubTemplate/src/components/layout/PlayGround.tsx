interface PlayGroundProps {
    url?: string;
}

export function PlayGround({ url }: PlayGroundProps) {
    return (
        <div className="h-full w-auto flex bg-gray-900">
            <iframe
                src={url}
                scrolling="no"
                allowFullScreen
                loading="eager"
                style={{ border: "0px", backgroundColor: "rgb(255, 255, 255)", width: "100%", height: "100%" }}
            />
        </div>
    );
}
