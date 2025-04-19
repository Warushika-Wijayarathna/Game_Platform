import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { saveGameScore } from "@/api/play";

const SCORE_INITIAL = 0;
const SCORE_DECAY_RATE = 0.2;

interface PlaygroundBottomActionProps {
    gameStarted: boolean;
    gameId: string;
    currentScore: number;
    onScoreUpdate: (score: number) => void;
    onExit: () => Promise<void>;
    showDialog: boolean;
    setShowDialog: (open: boolean) => void;
}

export default function PlaygroundBottomAction({
                                                   gameStarted,
                                                   gameId,
                                                   currentScore,
                                                   onScoreUpdate,
                                                   onExit,
                                                   showDialog,
                                                   setShowDialog
                                               }: PlaygroundBottomActionProps) {
    const [displayScore, setDisplayScore] = useState(SCORE_INITIAL);
    const scoreRef = useRef(SCORE_INITIAL);
    const animationRef = useRef<number>();
    const startTimeRef = useRef<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const updateScore = useCallback(() => {
        if (!startTimeRef.current) return;
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const newScore = Math.floor(elapsed * SCORE_DECAY_RATE);

        if (newScore !== scoreRef.current) {
            scoreRef.current = newScore;
            setDisplayScore(newScore);
            onScoreUpdate(newScore);
        }

        animationRef.current = requestAnimationFrame(updateScore);
    }, [onScoreUpdate]);

    useEffect(() => {
        if (gameStarted) {
            startTimeRef.current = Date.now();
            scoreRef.current = SCORE_INITIAL;
            setDisplayScore(SCORE_INITIAL);
            onScoreUpdate(SCORE_INITIAL);
            animationRef.current = requestAnimationFrame(updateScore);
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            startTimeRef.current = null;
            scoreRef.current = SCORE_INITIAL;
            setDisplayScore(SCORE_INITIAL);
            onScoreUpdate(SCORE_INITIAL);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [gameStarted, updateScore, onScoreUpdate]);


    const handleExit = async () => {
        setIsSaving(true);
        await saveGameScore(gameId, displayScore);
        await onExit();
        setIsSaving(false);
    };

    return (
        <div className="p-5 bg-gray-800/50 backdrop-blur-sm">
            <div className="flex justify-between items-center">
                <div className="text-white">
                    <h2 className="text-xl font-bold animate-pulse">
                        SCORE: <span className="text-[#FFB800]">{displayScore}</span>
                    </h2>
                </div>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="hover:scale-105 transition-transform"
                            onClick={() => {
                                console.log("Opening dialog...");
                                setShowDialog(true);
                            }}
                        >
                            Exit Game
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white border-gray-700">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Confirm Exit</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-300 mb-4">
                            {displayScore > 0
                                ? `Your current score is ${displayScore}. Are you sure you want to quit?`
                                : "Are you sure you want to exit?"}
                        </p>
                        <DialogFooter className="flex gap-3 justify-end">
                            <DialogClose asChild>
                                <Button variant="outline" className="border-gray-600">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={handleExit}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Confirm Exit"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
