import React from "react";
import { Games } from "@/api/games";

interface GameDetailsTableProps {
    games: Games[];
}

const GameDetailsTable: React.FC<GameDetailsTableProps> = ({ games }) => {
    function handleDelete(id: string): void {
        console.log(`Delete game with ID: ${id}`);
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white border border-gray-700">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-700">Game ID</th>
                        <th className="px-4 py-2 border-b border-gray-700">Name</th>
                        <th className="px-4 py-2 border-b border-gray-700">Category</th>
                        <th className="px-4 py-2 border-b border-gray-700">Price</th>
                        <th className="px-4 py-2 border-b border-gray-700">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id} className="hover:bg-gray-700">
                            <td className="px-4 py-2 border-b border-gray-700">{game.id}</td>
                            <td className="px-4 py-2 border-b border-gray-700">{game.name}</td>
                            <td className="px-4 py-2 border-b border-gray-700">{game.category.name}</td>
                            <td className="px-4 py-2 border-b border-gray-700">{game.price}</td>
                            <td className="px-4 py-2 border-b border-gray-700">
                                {game.isApproved ? "Approved" : "Pending"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GameDetailsTable;
