import React, {useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";
import { FiUploadCloud, FiX } from "react-icons/fi";
import {getUser} from "@/api/user.tsx";
import PasswordModal from "./modal/PasswordModal";
import {fetchAllCategories} from "@/api/categories.tsx";
import {Games, uploadDeveloperGames} from "@/api/games.tsx";
import "firebase/compat/storage";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import "firebase/compat/storage";
import { storage } from "@/config/firebase-config";
import {User} from "lucide-react";

const styles = ["pixel", "bottts", "avataaars", "micah", "adventurer"];
const skinTones = ["#ffdbac", "#f1c27d", "#e0ac69", "#c68642", "#8d5524"];
const accessories = ["roundGlasses", "sunglasses", "smallGlasses", "mustache", "none"];

const optionsMap = {
    pixel: { accessories: [], skinTones: [] },
    bottts: { accessories: [], skinTones: [] },
    avataaars: {
        accessories: ["glasses", "hat", "none"],
        skinTones: ["light", "brown", "darkBrown", "black", "yellow"]
    },
    micah: {
        accessories: ["roundGlasses", "sunglasses", "smallGlasses", "mustache", "none"],
        skinTones
    },
    adventurer: {
        accessories: ["glasses", "sunglasses", "none"],
        skinTones: ["light", "brown", "darkBrown", "black", "yellow"]
    },
};

const GameUploadModal = ({ onClose }) => {
    const [gameData, setGameData] = useState({
        name: '',
        description: '',
        category: null,
        rules: '',
        price: '',
        url: '',
        image: null,
        active: false,
        approved: false,
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await fetchAllCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        };

        loadCategories();
    }, []);

    const [dragActive, setDragActive] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGameData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFile = async (file) => {
        if (file && ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (e) => setUploadedImage(e.target.result);
            reader.readAsDataURL(file);

            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `game-images/${file.name}`);
            try {
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Update gameData with the image URL
                setGameData((prev) => ({ ...prev, image: downloadURL }));
            } catch (error) {
                console.error("Failed to upload image:", error);
            }
        }
    };


    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submitting game data============================>:", gameData);
        // Ensure the image URL is available before submitting
        if (!gameData.image) {
            console.error("Image upload is still in progress or failed.");
            return;
        }

        const game: Games = {
            ...gameData,
            id: '', // Provide a unique ID for the game
            hostedUrl: gameData.url, // Map the URL from gameData
            isApproved: gameData.approved, // Map the approved status from gameData
            category: categories.find(cat => cat.name === gameData.category) || null,
            uploadedBy: {
                uid: localStorage.getItem('userId') || '',
                name: localStorage.getItem('userName') || '',
                email: localStorage.getItem('userEmail') || '',
                role: 'DEVELOPER',
                active: true
            }
        };

        try {
            await uploadDeveloperGames(game);
            console.log("Game data submitted:", gameData);
            onClose();
        } catch (error) {
            console.error("Failed to submit game data:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gray-800 rounded-xl p-6 w-full max-w-2xl text-white"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Upload New Game</h2>
                    <button onClick={onClose} className="p-2 hover:text-yellow-400">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-semibold">Game Name</label>
                            <input
                                type="text"
                                name="name"
                                value={gameData.name}
                                onChange={handleChange}
                                placeholder="Enter game name"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Category</label>
                            <select
                                name="category"
                                value={gameData.category || ""}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Description</label>
                        <textarea
                            name="description"
                            value={gameData.description}
                            onChange={handleChange}
                            placeholder="Enter game description"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 h-24"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Rules</label>
                        <textarea
                            name="rules"
                            value={gameData.rules}
                            onChange={handleChange}
                            placeholder="Enter game rules"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 h-24"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

                        <div>
                            <label className="block mb-2 font-semibold">Hosted URL</label>
                            <input
                                type="url"
                                name="url"
                                value={gameData.url}
                                onChange={handleChange}
                                placeholder="https://your-game-domain.com"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Upload Image</label>
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
                ${dragActive ? 'border-yellow-400 bg-gray-700' : 'border-gray-600'}`}
                        >
                            <div className="space-y-2">
                                <FiUploadCloud className="mx-auto text-3xl" />
                                <p className="text-sm whitespace-pre-line">
                                    {uploadedImage ?
                                        gameData.image:
                                        'Drag & Drop Files Here\nPNG, JPG, WebP, SVG'}
                                </p>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept=".png,.jpg,.jpeg,.webp,.svg"
                                    onChange={(e) => handleFile(e.target.files[0])}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-block mt-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                                >
                                    Browse File
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded transition-colors"
                    >
                        Save Game
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default function Profile() {

    interface Profile {
        name?: string;
        email?: string;
        password?: string;
    }
    const [profile, setProfile] = useState<Profile>({});
    const [isDeveloper, setIsDeveloper] = useState(false);
    const [avatarStyle, setAvatarStyle] = useState("avataaars");
    const [skinTone, setSkinTone] = useState("#ffdbac");
    const [accessory, setAccessory] = useState("none");
    const [showGameModal, setShowGameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser();
            setProfile(userData);
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const getAvatarUrl = () => {
        const base = `https://api.dicebear.com/8.x/${avatarStyle}/svg`;
        const params = new URLSearchParams();

        if (optionsMap[avatarStyle].skinTones.includes(skinTone)) {
            if (["micah", "adventurer"].includes(avatarStyle)) {
                params.append("baseColor", skinTone);
            } else {
                params.append("skinColor", skinTone);
            }
        }

        if (optionsMap[avatarStyle].accessories.includes(accessory)) {
            if (avatarStyle === "micah") {
                params.append("accessoriesType", accessory);
            } else {
                params.append("accessories", accessory);
            }
        }

        return `${base}?${params.toString()}`;
    };

    const avatarUrl = getAvatarUrl();


    const handleSave = () => {
        setShowPasswordModal(true);
    };

    const handlePasswordConfirm = (password, profile: Profile) => {
        console.log("Password entered:", password);
        console.log("Profile changes saved:", profile);
        setShowPasswordModal(false);
    };

    const getSkinToneName = (hex) => {
        const names = {
            "#ffdbac": "Light",
            "#f1c27d": "Tan",
            "#e0ac69": "Medium",
            "#c68642": "Dark",
            "#8d5524": "Deep"
        };
        return names[hex] || hex;
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto p-6 text-white">
            {showPasswordModal && (
                <PasswordModal
                    onClose={() => setShowPasswordModal(false)}
                    onConfirm={(password) => handlePasswordConfirm(password, profile)}
                    updatedProfile={profile}
                />
            )}
            {showGameModal && <GameUploadModal onClose={() => setShowGameModal(false)} />}

            {/* Profile Header */}
            <div className="mb-10 flex items-center gap-4">
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full border-2 border-yellow-400"
                />
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, {profile.name}!
                    </h1>
                    <p className="text-gray-400">
                        Manage your profile and developer status.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Profile Edit Section */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Edit Profile
                    </h2>
                    <div className="space-y-4">
                        {["name", "email", "password"].map((field) => (
                            <div key={field}>
                                <label className="block text-white mb-1 capitalize">
                                    {field}
                                </label>
                                <input
                                    value={profile[field] || ""}
                                    name={field}
                                    type={field === "password" ? "password" : "text"}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                                    placeholder={`Enter your ${field}`}
                                    readOnly={field === "email"}
                                />
                            </div>
                        ))}
                        <button
                            onClick={handleSave}
                            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded w-full transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Developer Section */}
                <motion.div
                    className="bg-gray-800 p-6 rounded-xl shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {!isDeveloper ? (
                        <>
                            <h2 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                                <FaRocket /> Want to become a ZPlay Developer?
                            </h2>
                            <p className="text-gray-300 mt-2 mb-4">
                                Join our creator community and share your games with the world.
                            </p>
                            <button
                                onClick={() => setIsDeveloper(true)}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 rounded transition-colors"
                            >
                                Become a Developer
                            </button>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-xl font-bold text-white mb-2">
                                Welcome, Developer!
                            </h2>
                            <p className="text-gray-400 mb-4">
                                You're now part of the creator hub 🎮
                            </p>
                            <button
                                onClick={() => setShowGameModal(true)}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 rounded transition-colors"
                            >
                                Upload Your Game
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Avatar Customization Section */}
            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Customize Your Avatar</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    <img
                        src={avatarUrl}
                        className="w-40 h-40 rounded-full border-4 border-yellow-400"
                        alt="Avatar preview"
                    />

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-semibold mb-2">Style</label>
                            <div className="flex flex-wrap gap-2">
                                {styles.map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setAvatarStyle(style)}
                                        className={`p-2 rounded border text-sm ${
                                            avatarStyle === style
                                                ? "bg-yellow-400 text-black border-yellow-400"
                                                : "bg-gray-700 border-gray-600 hover:border-gray-400"
                                        } transition-colors`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Skin Tone</label>
                            <div className="flex flex-wrap gap-2">
                                {optionsMap[avatarStyle].skinTones.map((tone) => (
                                    <button
                                        key={tone}
                                        onClick={() => setSkinTone(tone)}
                                        className={`p-2 rounded border text-sm ${
                                            skinTone === tone
                                                ? "bg-yellow-400 text-black border-yellow-400"
                                                : "bg-gray-700 border-gray-600 hover:border-gray-400"
                                        } transition-colors`}
                                        title={tone}
                                    >
                                        {getSkinToneName(tone)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Accessory</label>
                            <div className="flex flex-wrap gap-2">
                                {optionsMap[avatarStyle].accessories.map((acc) => (
                                    <button
                                        key={acc}
                                        onClick={() => setAccessory(acc)}
                                        className={`p-2 rounded border text-sm ${
                                            accessory === acc
                                                ? "bg-yellow-400 text-black border-yellow-400"
                                                : "bg-gray-700 border-gray-600 hover:border-gray-400"
                                        } transition-colors`}
                                    >
                                        {acc.replace(/([A-Z])/g, ' $1').trim()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
