import React, {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import {fetchAllCategories} from "@/api/categories.tsx";

const GameUploadModal = ({ onClose }) => {
    const [gameData, setGameData] = useState({
        name: '',
        description: '',
        category: '',
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGameData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const [dragActive, setDragActive] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleFile = (file) => {
        if (file && ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (e) => setUploadedImage(e.target.result);
            reader.readAsDataURL(file);
            setGameData(prev => ({ ...prev, image: file }));
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        // pass form data to your API or state management
        console.log(gameData);
        onClose();
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
                                value={gameData.category}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-semibold">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={gameData.price}
                                onChange={handleChange}
                                placeholder="Enter game price"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

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
                                <p className="text-sm">
                                    {uploadedImage ?
                                        gameData.image.name :
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
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={gameData.active}
                                onChange={handleChange}
                                className="w-4 h-4 text-yellow-400"
                            />
                            Active
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="approved"
                                checked={gameData.approved}
                                onChange={handleChange}
                                className="w-4 h-4 text-yellow-400"
                            />
                            Approved
                        </label>
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

export default GameUploadModal;
