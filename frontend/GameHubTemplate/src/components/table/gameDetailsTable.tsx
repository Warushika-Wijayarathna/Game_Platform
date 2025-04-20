import React from "react";

const GameDetailsTable = () => {
    interface UploadGames {
        id: number;
        name: string;
        uploadDate: string;
        status: string;
    }

    const games: UploadGames[] = [
        { id: 1, name: "Game A", uploadDate: "2023-10-01", status: "Uploaded" },
        { id: 2, name: "Game B", uploadDate: "2023-10-02", status: "Pending" },
        { id: 3, name: "Game C", uploadDate: "2023-10-03", status: "Approved" },
        { id: 4, name: "Game D", uploadDate: "2023-10-04", status: "Rejected" },
        { id: 5, name: "Game E", uploadDate: "2023-10-05", status: "Uploaded" },
    ];

    function handlDelete(id: number): void {
        console.log(`Delete game with ID: ${id}`);
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white border border-gray-700">
                <thead>
                <tr>
                    <th className="px-4 py-2 border-b border-gray-700">Game ID</th>
                    <th className="px-4 py-2 border-b border-gray-700">Name</th>
                    <th className="px-4 py-2 border-b border-gray-700">Upload Date</th>
                    <th className="px-4 py-2 border-b border-gray-700">Status</th>
                    <th className="px-4 py-2 border-b border-gray-700">Delete</th>
                </tr>
                </thead>
                <tbody>
                {games.map((game) => (
                    <tr key={game.id} className="hover:bg-gray-700">
                        <td className="px-4 py-2 border-b border-gray-700">{game.id}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{game.name}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{game.uploadDate}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{game.status}</td>
                        <td className="px-4 py-2 border-b border-gray-700">
                            <button
                                onClick={() => handlDelete(game.id)}
                                className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GameDetailsTable;