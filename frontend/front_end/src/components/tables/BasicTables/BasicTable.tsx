import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {faPlugCircleCheck, faPlugCircleXmark} from "@fortawesome/free-solid-svg-icons";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import {Category} from "../../../api/category.tsx";
import {User} from "../../../api/games.tsx";
import {Users} from "../../../api/user.tsx";

export interface Column<T> {
    header: string;
    accessor: keyof T;
    cell?: (value: React.ReactNode, row: T) => React.ReactNode;
}

interface BasicTableProps<T extends Record<string, React.ReactNode>> {
    data: T[];
    columns: Column<T>[];
    emptyMessage: string;
}

export default class BasicTable<T extends { id?: number | string; uid?: number | string }> extends Component<BasicTableProps<T>> {    render() {
        const { data, columns, emptyMessage } = this.props;

        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={String(column.accessor)}
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            {column.header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {data.length === 0 ? (
                                    <TableRow>
                                        <td colSpan={columns.length} className="text-center py-4">
                                            {emptyMessage}
                                        </td>
                                    </TableRow>
                                ) : (
                                    data.map((item) => (
                                        <TableRow key={item.id}>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={String(column.accessor)}
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                                >
                                                    {column.cell
                                                        ? column.cell(item[column.accessor] as React.ReactNode, item)
                                                        : (item[column.accessor] as React.ReactNode)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}

// Usage example for Games:
interface GameTableProps {
    games: Game[];
    onEditGame?: (game: Game) => void;
    onDeactivateGame?: (gameId: string) => void;
}

export class GameTable extends Component<GameTableProps> {
    columns: Column<Game>[] = [
        {
            header: "Game Name",
            accessor: "name",
            cell: (_, game) => (
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
          {game.name}
        </span>
            )
        },
        {
            header: "Image",
            accessor: "imageUrl",
            cell: (imageUrl) => (
                <img
                    src={imageUrl as string}
                    alt="Game"
                    className="w-16 h-16 object-cover rounded"
                />
            )
        },
        { header: "Category", accessor: "category", cell: (_, game) => game.category.name },
        { header: "Price", accessor: "price" },
        {
            header: "Status",
            accessor: "active",
            cell: (active) => (
                <Badge
                    size="sm"
                    color={active ? "success" : "warning"}
                >
                    {active ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            header: "Approved",
            accessor: "isApproved",
            cell: (approved) => (
                <Badge
                    size="sm"
                    color={approved ? "success" : "warning"}
                >
                    {approved ? "Approved" : "Not Approved"}
                </Badge>
            )
        },
        {
            header: "Actions",
            accessor: "id",
            cell: (_, game) => (
                <div className="flex items-center gap-3">
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => this.props.onEditGame?.(game)}
                        type={"button"}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                        className="text-red-500 hover:underline"
                        onClick={() => this.props.onDeactivateGame?.(game.id)}
                        type={"button"}
                    >
                        <FontAwesomeIcon icon={faPlugCircleXmark} />
                    </button>
                </div>
            )
        }
    ];

    render() {
        return (
            <BasicTable<Game>
                data={this.props.games}
                columns={this.columns}
                emptyMessage="No games found"
            />
        );
    }
}

// Game type definition
export interface Game {
    id: string;
    name: string;
    description?: string;
    category: {
        id: string;
        name: string;
        active: boolean;
    };
    price?: string;
    active?: boolean;
    uploadedBy: User;
    imageUrl: string;
    hostedUrl: string;
    rules: string;
    isApproved: boolean;
}

// Category Table Component
interface CategoryTableProps {
    categories: Category[];
    onEditCategory?: (category: Category) => void;
    onDeactivateCategory?: (id: number) => void;
}

export class CategoryTable extends Component<CategoryTableProps> {
    columns: Column<Category>[] = [
        {
            header: "Category Name",
            accessor: "name",
            cell: (_, category) => (
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {category.name}
                </span>
            )
        },
        {
            header: "Status",
            accessor: "active",
            cell: (active) => (
                <Badge
                    size="sm"
                    color={active ? "success" : "warning"}
                >
                    {active ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            header: "Actions",
            accessor: "id",
            cell: (_, category) => (
                <div className="flex items-center gap-3">
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => this.props.onEditCategory?.(category)}
                        type={"button"}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                        className="text-red-500 hover:underline"
                        onClick={()=> this.props.onDeactivateCategory?.(category.id)}
                        type={"button"}
                    >
                        <FontAwesomeIcon icon={faPlugCircleXmark} />
                    </button>
                </div>
            )
        }
    ];

    render() {
        return (
            <BasicTable<Category>
                data={this.props.categories}
                columns={this.columns}
                emptyMessage="No categories found"
            />
        );
    }
}

interface UserTableProps {
    users: Users[];
    onEditUser?: (user: Users) => void;
    onDeactivateUser?: (userId: string | number) => void;
    onActivateUser?: (userId: string | number) => void;
}

export class UserTable extends Component<UserTableProps> {
    columns: Column<Users>[] = [
        {
            header: "Name",
            accessor: "name",
            cell: (_, user) => (
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {user.name}
                </span>
            )
        },
        {
            header: "Email",
            accessor: "email",
            cell: (email) => (
                <span className="block text-gray-600 text-theme-sm dark:text-gray-400">
                    {email}
                </span>
            )
        },
        {
            header: "Role",
            accessor: "role",
            cell: (role) => (
                <Badge
                    size="sm"
                    color={role === "ADMIN" ? "success" : "info"}
                >
                    {role}
                </Badge>
            )
        },
        {
            header: "Status",
            accessor: "active",
            cell: (isActive) => (
                <Badge
                    size="sm"
                    color={isActive ? "success" : "warning"}
                >
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            header: "Actions",
            accessor: "uid",
            cell: (_, user) => (
                <div className="flex items-center gap-3">
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => this.props.onEditUser?.(user)}
                        type={"button"}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                        className="text-red-500 hover:underline"
                        onClick={() => this.props.onDeactivateUser?.(user.uid)}
                        type={"button"}
                    >
                        <FontAwesomeIcon icon={faPlugCircleXmark} />
                    </button>
                {/*    add activate button too*/}
                    <button
                        className="text-green-500 hover:underline"
                        onClick={() => this.props.onActivateUser?.(user.uid)}
                        type={"button"}
                    >
                        <FontAwesomeIcon icon={faPlugCircleCheck} />
                    </button>
                </div>
            )
        }
    ];

    render() {
        return (
            <BasicTable<Users>
                data={this.props.users}
                columns={this.columns}
                emptyMessage="No users found"
            />
        );
    }
}
