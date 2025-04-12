import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faPlugCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import {deactivateGame, User } from "../../../api/games.tsx";

export interface Game {
    id: string;
    name: string;
    description?: string; // Make optional
    category: {
        id: string;
        name: string;
        active: boolean;
    };
    price?: string; // Make optional
    active?: boolean;
    uploadedBy: User;
    imageUrl: string;
    hostedUrl: string;
    rules: string;
    isApproved: boolean;
}

interface BasicTableOneProps {
    games: Game[],
    onEditGame?: (game: Game) => void
}

export default function BasicTableOne({ games, onEditGame }: BasicTableOneProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Game Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Description
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Category
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Price
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Status
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Approved
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {games.map((game) => {
                                return (
                                    <TableRow key={game.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {game.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {game.description}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {game.category.name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {game.price}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Badge
                                                size="sm"
                                                color={
                                                    game.active === true
                                                        ? "success"
                                                        : game.active === false
                                                            ? "warning"
                                                            : "error"
                                                }
                                            >
                                                {game.active !== undefined ? (game.active ? "Active" : "Inactive") : "Unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Badge
                                                size="sm"
                                                color={
                                                    game.isApproved
                                                        ? "success"
                                                        : !game.isApproved
                                                            ? "warning"
                                                            : "error"
                                                }
                                            >
                                                {game.isApproved !== undefined ? (game.isApproved ? "Approved" : "Not Approved") : "Unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <button className="text-blue-500 hover:underline" type={"button"}
                                                        onClick={() => onEditGame && onEditGame(game)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>
                                                <button className="text-red-500 hover:underline" type={"button"}
                                                        onClick={() => deactivateGame(game.id)}>
                                                    <FontAwesomeIcon icon={faPlugCircleXmark} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
