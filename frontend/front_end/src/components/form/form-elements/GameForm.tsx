import { useState, useEffect} from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import TextArea from "../input/TextArea";
import DropzoneComponent from "./DropZone";
import Button from "../../ui/button/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useTheme} from "../../../context/ThemeContext.tsx";
import {saveCategory, loadAllCategories} from "../../../api/category.tsx";
import Form from "../Form.tsx";
import Checkbox from "../input/Checkbox";
import {loadAllGames, saveGame, User, Games, updateGame, deactivateGame} from "../../../api/games";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {storage} from "../../../config/firebase-config";
import {Game, GameTable} from "../../tables/BasicTables/BasicTable.tsx";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import Alert from "../../ui/alert/Alert.tsx";

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
    hostedUrl: string;
    active: boolean;
    isApproved: boolean;
    uploadedBy: User;
    imageUrl: string;
}


export default function GameForm() {

    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null); // Clear the alert after 5 seconds
            }, 5000);

            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [alert]);

    const {theme} = useTheme();
    const [editingGameId, setEditingGameId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Array<{ value: string; label: string; original: Category }>>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [gameData, setGameData] = useState<GameFormData>({
        name: "",
        description: "",
        category: {id: "", name: "", active: false},
        rules: "",
        price: "",
        image: null,
        hostedUrl: "",
        active: false,
        isApproved: false,
        uploadedBy: {uid: "", name: "", email: "", role: ""},
        imageUrl: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [resetDropzone, setResetDropzone] = useState(false);


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
                        },
                        isApproved: game.isApproved || false
                    }))
                );
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchData();
    }, []);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

    const handleDeactivateGame = (gameId: string): void => {
        setSelectedGameId(gameId);
        setIsDialogOpen(true);
    };

    const confirmDeactivation = async () => {
        if (!selectedGameId) return;

        try {
            await deactivateGame(selectedGameId);
            const updatedGames = (await loadAllGames()).map((game: Games) => ({
                ...game,
                imageUrl: game.image,
                category: {
                    id: "",
                    name: game.category.name,
                    active: false
                },
                isApproved: game.isApproved,
            }));
            setGames(updatedGames);
            setAlert({ type: "success", message: "Game deactivated successfully!" });
        } catch (error) {
            console.error("Error deactivating game:", error);
            setAlert({ type: "error", message: "Failed to deactivate the game. Please try again." });
        } finally {
            setIsDialogOpen(false);
            setSelectedGameId(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setGameData((prev) => ({...prev, [name]: value}));
    };

    const handleSelectChange = (selectedOption: { value: string; label: string; original: Category } | null) => {
        setGameData((prev) => ({
            ...prev,
            category: selectedOption ? selectedOption.original : {id: "", name: "", active: false}
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setGameData((prev) => ({...prev, [name]: checked}));
    };

    const handleFileUpload = async (file: File, path: string) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => reject(error),
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

    const validateUrl = (url: string) => {
        return url.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateUrl(gameData.hostedUrl)) {
            setAlert({ type: "error", message: "Invalid URL format. Please enter a valid URL." });
            return;
        }

        setIsUploading(true);

        try {
            let imageUrl = gameData.imageUrl || '';
            if (gameData.image) {
                imageUrl = await handleFileUpload(gameData.image, `images/${gameData.image.name}`);
            }

            const gamePayload = {
                ...gameData,
                id: editingGameId || '',
                image: imageUrl || gameData.imageUrl,
                category: {
                    id: gameData.category.id,
                    name: gameData.category.name,
                    active: gameData.category.active,
                },
                isApproved: gameData.isApproved,
            };

            if (editingGameId) {
                try {
                    await updateGame(editingGameId, gamePayload);
                    setAlert({ type: "success", message: "Game updated successfully!" });
                } catch (error) {
                    console.error(error);
                    setAlert({ type: "error", message: "Failed to update the game. Please try again." });
                }

            } else {
                try {
                    await saveGame(gamePayload);
                    setAlert({ type: "success", message: "Game saved successfully!" });
                } catch (error) {
                    console.error(error);
                    setAlert({ type: "error", message: "Failed to save the game. Please try again." });
                }
            }

            // Reset form, including the image field
            setGameData({
                name: "",
                description: "",
                category: {id: "", name: "", active: false},
                rules: "",
                price: "",
                image: null, // Reset the image field
                hostedUrl: "",
                active: false,
                isApproved: false,
                uploadedBy: {uid: "", name: "", email: "", role: ""},
                imageUrl: ""
            });
            setEditingGameId(null);

            // Refresh game list
            const updatedGames = (await loadAllGames()).map((game: Games) => ({
                ...game,
                imageUrl: game.image,
                category: {
                    id: "",
                    name: game.category.name,
                    active: false
                },
                isApproved: game.isApproved,
            }));
            setGames(updatedGames);

            console.log("Savinggggggggggggggggggggggg=====0", gamePayload);
            setResetDropzone(true);
            setTimeout(() => setResetDropzone(false), 0);
        } catch (error) {
            console.error("Submission error:", error);
            setAlert({ type: "error", message: "Failed to save the game. Please try again." });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newCategory = (e.target as HTMLFormElement).newCategory.value;
        if (newCategory) {
            try {
                await saveCategory({name: newCategory, active: true});
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
                setAlert({ type: "error", message: "Failed to add category. Please try again." });
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
            hostedUrl: game.hostedUrl,
            active: game.active || false,
            isApproved: game.isApproved || false,
            uploadedBy: game.uploadedBy,
            imageUrl: game.imageUrl || ''
        });
    };

    return (
        <ComponentCard title="Add New Game">
            <div className="max-w-8xl mx-full">
                {alert && (
                    <Alert
                        variant={alert.type}
                        title={alert.type === "success" ? "Success" : "Error"}
                        message={alert.message}
                        showLink={false}
                    />
                )}
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
                                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4"/>
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
                                <Label htmlFor="hostedUrl">Hosted URL</Label>
                                <Input
                                    type="url"
                                    id="hostedUrl"
                                    name="hostedUrl"
                                    value={gameData.hostedUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://your-game-domain.com"
                                    required
                                />
                            </div>

                            <div>
                                <Label>Upload Image</Label>
                                <DropzoneComponent
                                    id="image"
                                    onDrop={(files) => setGameData((prev) => ({...prev, image: files[0]}))}
                                    reset={resetDropzone}
                                    accept="image/*"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="active"
                                        checked={gameData.active}
                                        onChange={(checked) => handleCheckboxChange({
                                            target: {
                                                name: "active",
                                                checked
                                            }
                                        } as React.ChangeEvent<HTMLInputElement>)}
                                    />
                                    <Label htmlFor="active">Active</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="isApproved"
                                        checked={gameData.isApproved}
                                        onChange={(checked) => handleCheckboxChange({
                                            target: {
                                                name: "isApproved",
                                                checked
                                            }
                                        } as React.ChangeEvent<HTMLInputElement>)}/>
                                    <Label htmlFor="isApproved">Approved</Label>
                                </div>
                            </div>

                            <div className="text-right">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    type="submit"
                                    disabled={isUploading}
                                >
                                    {isUploading ? `Uploading... (${Math.round(uploadProgress)}%)` : "Save Game"}
                                </Button>
                            </div>
                        </div>

                        <div className="col-span-3 space-y-6">
                            <GameTable
                                games={games}
                                onEditGame={handleEditGame}
                                onDeactivateGame={handleDeactivateGame}
                                />
                        </div>

                        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="relative z-10">
                            <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
                            <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl">
                                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Confirm Deactivation
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to deactivate this game? This action cannot be undone.
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsDialogOpen(false)}
                                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmDeactivation}
                                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                                        >
                                            Deactivate
                                        </button>
                                    </div>
                                </DialogPanel>
                            </div>
                        </Dialog>
                    </div>

                    {isUploading && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} w-full max-w-md`}>
                                <h3 className="text-lg font-medium mb-4">Uploading Image...</h3>
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
