import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar.tsx";
import { PlayGround } from "@/components/layout/PlayGround.tsx";
import PlaygroundBottomAction from "@/components/ui/playgroundBottomAction.tsx";

export default function playGame() {
    const location = useLocation();
    const { item } = location.state || {};

    const gameUrl = item.image;

    return (
        <div className=" h-fit flex bg-gray-900">
            <div className="h-full fixed">
                <Sidebar activeItem="store" />
            </div>
            <div className="ml-[360px]">
                <div className="p-6">
                    {item ? (
                        <>
                            <h1 className="text-3xl font-bold text-white mb-4">{item.name}</h1>
                        </>
                    ) : (
                        <p className="text-lg text-white">No game selected.</p>
                    )}
                </div>
                <div className="h-[600px] w-[900px] bg-cyan-500 p-1 mt-3">
                    <PlayGround url="https://www.onlinegames.io/games/2024/unity/drift-king/index.html" />

                    <div className="p-1">
                        <PlaygroundBottomAction />
                    </div>

                </div>
            </div>
        </div>
    );
}
