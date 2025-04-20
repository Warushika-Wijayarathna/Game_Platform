import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import GameDetailsTable from "@/components/table/gameDetailsTable";
import { getUploadedGamesByUser } from "@/api/games";
import { Games } from "@/api/games";

interface GameDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({ isOpen, onClose }) => {
    const [uploadedGames, setUploadedGames] = useState<Games[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                const games = await getUploadedGamesByUser();
                setUploadedGames(games);
            } catch (err) {
                setError("Failed to load uploaded games. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchGames();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gray-800 rounded-xl p-6 w-full max-w-4xl text-white"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Game Details</h2>
                    <button onClick={onClose} className="p-2 hover:text-yellow-400">
                        <FiX size={24} />
                    </button>
                </div>

                {loading ? (
                    <p>Loading games...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <GameDetailsTable games={uploadedGames} />
                )}
            </motion.div>
        </div>
    );
};

export default GameDetailsModal;
