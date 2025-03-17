import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import TextArea from "../input/TextArea.tsx";
import DropzoneComponent from "./DropZone.tsx";
import Button from "../../ui/button/Button.tsx";
import DropzoneAnyComponent from "./DropZone-Any.tsx";
import { saveGame } from "../../api/games";
import { storage } from "../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function GameForm() {
  const [gameData, setGameData] = useState({
    name: "",
    description: "",
    category: "",
    rules: "",
    price: "",
    image: null,
    filepath: "",
  });

  const categories = [
    { value: "Action", label: "Action" },
    { value: "Adventure", label: "Adventure" },
    { value: "Puzzle", label: "Puzzle" },
    { value: "Strategy", label: "Strategy" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setGameData((prev) => ({ ...prev, category: value }));
  };

  const handleFileUpload = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (gameData.image) {
        const imageUrl = await handleFileUpload(gameData.image, `images/${gameData.image.name}`);
        gameData.image = imageUrl;
      }
      if (gameData.filepath) {
        const fileUrl = await handleFileUpload(gameData.filepath, `files/${gameData.filepath.name}`);
        gameData.filepath = fileUrl;
      }
      const savedGame = await saveGame(gameData);
      console.log("Game saved successfully:", savedGame);
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  return (
      <ComponentCard title="Add New Game">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Game Name</Label>
            <Input type="text" id="name" name="name" value={gameData.name} onChange={handleInputChange}/>
          </div>

          <div>
            <Label>Description</Label>
            <TextArea rows={4} value={gameData.description} />
          </div>

          <div>
            <Label>Category</Label>
            <Select options={categories} placeholder="Select Category" onChange={handleSelectChange} />
          </div>

          <div>
            <Label>Rules</Label>
            <TextArea rows={4} value={gameData.rules} />
          </div>

          <div>
            <Label>Price</Label>
            <Input type="text" name="price" value={gameData.price} onChange={handleInputChange} />
          </div>

          <div>
            <Label>Upload Image</Label>
            <DropzoneComponent/>
          </div>

          <div>
            <Label>Assets</Label>
            <DropzoneAnyComponent/>
          </div>

          <div className="text-right">
            <Button size="sm" variant="primary">
              Save Game
            </Button>
          </div>
        </form>
      </ComponentCard>
  );
}
