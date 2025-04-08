import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import TextArea from "../input/TextArea";
import DropzoneComponent from "./DropZone";
import Button from "../../ui/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../../context/ThemeContext.tsx";
import { saveCategory, loadAllCategories } from "../../../api/category.tsx";
import Form from "../Form.tsx";
import Checkbox from "../input/Checkbox";
import BasicTableOne, { Game } from "../../tables/BasicTables/BasicTableOne.tsx";
import {loadAllGames, saveGame, User, Games, updateGame} from "../../../api/games";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebase-config";

interface Category {
    id: string;
    name: string;
    active: boolean;
}

export interface GameFormData {
    name: string;
    description: string;
    category: Category;
    rules: string;
    price: string;
    image: File | null;
    gitHubRepo: string;
    active: boolean;
    uploadedBy: User;
    imageUrl: string;
}

export default function GameForm() {
    const { theme } = useTheme();
    const [editingGameId, setEditingGameId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Array<{ value: string; label: string; original: Category }>>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [gameData, setGameData] = useState<GameFormData>({
        name: "",
        description: "",
        category: { id: "", name: "", active: false },
        rules: "",
        price: "",
        image: null,
        gitHubRepo: "",
        active: true,
        uploadedBy: { uid: "", name: "", email: "", role: "" },
        imageUrl: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, gamesResponse] = await Promise.all([
                    loadAllCategories(),
                    loadAllGames()
                ]);
                setCategories(
                    (categoriesResponse.data || []).map((category: { id: number; name: string; active: boolean }) => ({
                        value: category.name,
                        label: category.name,
                        original: {
                            id: category.id.toString(),
                            name: category.name,
                            active: category.active
                        },
                    }))
                );
                setGames(
                    (gamesResponse || []).map((game: Games) => ({
                        ...game,
                        imageUrl: game.image,
                        category: {
                            id: "",
                            name: game.category.name,
                            active: false
                        }
                    }))
                );
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGameData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOption: { value: string; label: string; original: Category } | null) => {
        setGameData((prev) => ({
            ...prev,
            category: selectedOption ? selectedOption.original : { id: "", name: "", active: false }
        }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setGameData((prev) => ({ ...prev, active: checked }));
    };

    const handleFileUpload = async (file: File, path: string, onProgress?: (progress: number) => void) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress?.(progress);
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    };

    const validateGitHubUrl = (url: string) => {
        return url.match(/^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\.git)?(\/)?$/);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateGitHubUrl(gameData.gitHubRepo)) {
            alert("Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)");
            return;
        }

        setIsUploading(true);
        setUploadProgress(10);

        try {
            // 🚀 Deploy to Vercel via backend
            const backendResponse = await fetch(`http://localhost:8080/api/v1/deploy/vercel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repoUrl: gameData.gitHubRepo }),
            });

            if (!backendResponse.ok) {
                const errorText = await backendResponse.text();
                throw new Error(errorText || "Deployment failed");
            }

            const { message, url: deployedUrl } = await backendResponse.json();
            console.log("Deployed URL:", deployedUrl);
            setUploadProgress(60);

            // 📤 Upload image if present
            let imageUrl = gameData.imageUrl || '';
            if (gameData.image) {
                imageUrl = await handleFileUpload(
                    gameData.image,
                    `images/${gameData.image.name}`,
                    (progress) => setUploadProgress(60 + (progress * 0.3))
                );
            }

            // 🧾 Game payload with deployed link
            const gamePayload = {
                ...gameData,
                id: editingGameId || '',
                image: imageUrl || gameData.imageUrl,
                deployedLink: deployedUrl, // <— Add this field
                category: {
                    id: gameData.category.id,
                    name: gameData.category.name,
                    active: gameData.category.active,
                },
            };

            if (editingGameId) {
                await updateGame(editingGameId, gamePayload);
            } else {
                await saveGame(gamePayload);
            }

            setUploadProgress(100);

            // 🔁 Reset form
            setGameData({
                name: "",
                description: "",
                category: { id: "", name: "", active: false },
                rules: "",
                price: "",
                image: null,
                gitHubRepo: "",
                active: true,
                uploadedBy: { uid: "", name: "", email: "", role: "" },
                imageUrl: ""
            });
            setEditingGameId(null);

            const updatedGames = (await loadAllGames()).map((game: Games) => ({
                ...game,
                imageUrl: game.image,
                category: {
                    id: "",
                    name: game.category.name,
                    active: false
                }
            }));
            setGames(updatedGames);

        } catch (error) {
            console.error("Deployment error details:", {
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined
            });

            alert(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newCategory = (e.target as HTMLFormElement).newCategory.value;
        if (newCategory) {
            try {
                await saveCategory({ name: newCategory, active: true });
                setShowModal(false);

                const response = await loadAllCategories();
                setCategories(
                    response.data.map((category: { id: number; name: string; active: boolean }) => ({
                        value: category.name,
                        label: category.name,
                        original: {
                            id: category.id.toString(),
                            name: category.name,
                            active: category.active
                        },
                    }))
                );
            } catch (error) {
                console.error("Error saving category:", error);
                alert("Failed to save category. Please try again.");
            }
        }
    };

    const handleEditGame = (game: Game) => {
        setEditingGameId(game.id);
        setGameData({
            name: game.name,
            description: game.description || '',
            category: game.category,
            rules: game.rules || '',
            price: game.price || '0',
            image: null,
            gitHubRepo: game.gitHubRepo,
            active: game.active || false,
            uploadedBy: game.uploadedBy,
            imageUrl: game.imageUrl || ''
        });
    };

    return (
        <ComponentCard title="Add New Game">
            <div className="max-w-8xl mx-full">
                <Form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-1 space-y-6">
                            <div>
                                <Label htmlFor="name">Game Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={gameData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter game name"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <TextArea
                                    id="description"
                                    rows={4}
                                    name="description"
                                    value={gameData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter game description"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between space-x-2 pb-4">
                                    <Label>Category</Label>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="p-2 flex items-center"
                                        onClick={() => setShowModal(true)}
                                        type="button"
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Select
                                    id="category"
                                    options={categories}
                                    value={categories.find(category => category.original.id === gameData.category.id) || null}
                                    placeholder="Select Category"
                                    onChange={handleSelectChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="rules">Rules</Label>
                                <TextArea
                                    id="rules"
                                    rows={4}
                                    name="rules"
                                    value={gameData.rules}
                                    onChange={handleInputChange}
                                    placeholder="Enter game rules"
                                />
                            </div>

                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    type="text"
                                    id="price"
                                    name="price"
                                    value={gameData.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter game price"
                                />
                            </div>

                            <div>
                                <Label htmlFor="gitHubRepo">GitHub Repository</Label>
                                <Input
                                    type="url"
                                    id="gitHubRepo"
                                    name="gitHubRepo"
                                    value={gameData.gitHubRepo}
                                    onChange={handleInputChange}
                                    placeholder="https://github.com/username/repository.git"
                                    required
                                />
                            </div>

                            <div>
                                <Label>Upload Image</Label>
                                <DropzoneComponent
                                    id="image"
                                    onDrop={(files) => setGameData((prev) => ({ ...prev, image: files[0] }))}
                                    accept="image/*"
                                />
                            </div>

                            <div>
                                <Label htmlFor="active">Active</Label>
                                <Checkbox
                                    id="active"
                                    checked={gameData.active}
                                    onChange={handleCheckboxChange}
                                />
                            </div>

                            <div className="text-right">
                                <Button size="sm" variant="primary" type="submit" disabled={isUploading}>
                                    {isUploading ? "Uploading..." : "Save Game"}
                                </Button>
                            </div>
                        </div>

                        <div className="col-span-3 space-y-6">
                            <BasicTableOne games={games} onEditGame={handleEditGame} />
                        </div>
                    </div>

                    {isUploading && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} w-full max-w-md`}>
                                <h3 className="text-lg font-medium mb-4">Uploading Game...</h3>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className="bg-brand-500 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {Math.round(uploadProgress)}% complete
                                </p>
                            </div>
                        </div>
                    )}
                </Form>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className={`p-6 rounded shadow-lg ${
                            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl mb-4">Add New Category</h2>
                        <Form onSubmit={handleAddCategory}>
                            <div className="mb-4">
                                <Label htmlFor="newCategory">Category Name</Label>
                                <Input type="text" id="newCategory" name="newCategory" required />
                            </div>
                            <div className="text-right">
                                <Button size="sm" variant="primary" type="submit">
                                    Add Category
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </ComponentCard>
    );
}
