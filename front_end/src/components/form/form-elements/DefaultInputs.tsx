import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import TextArea from "../input/TextArea";
import DropzoneComponent from "./DropZone";
import Button from "../../ui/button/Button";
import DropzoneAnyComponent from "./DropZone-Any";
import { saveGame } from "../../../api/games";
import { storage } from "../../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function GameForm() {
  const [gameData, setGameData] = useState({
    name: "",
    description: "",
    category: "",
    rules: "",
    price: "",
    image: null as File | null,
    filepath: null as File | null,
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
      const imageUrl = gameData.image ? await handleFileUpload(gameData.image, `images/${gameData.image.name}`) : "";
      const fileUrl = gameData.filepath ? await handleFileUpload(gameData.filepath, `files/${gameData.filepath.name}`) : "";

      const updatedGameData = {
        ...gameData,
        image: imageUrl,
        filepath: fileUrl,
      };

      const savedGame = await saveGame(updatedGameData);
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
            <Input type="text" id="name" name="name" value={gameData.name} onChange={handleInputChange} />
          </div>

          <TextArea
              rows={4}
              name="description"
              value={gameData.description}
              onChange={(value) => setGameData((prev) => ({ ...prev, description: value }))}
          />

          <div>
            <Label>Category</Label>
            <Select options={categories} value={gameData.category} placeholder="Select Category" onChange={handleSelectChange} />
          </div>

          <TextArea
              rows={4}
              name="rules"
              value={gameData.rules}
              onChange={(value) => setGameData((prev) => ({ ...prev, rules: value }))}
          />


          <div>
            <Label>Price</Label>
            <Input type="text" name="price" value={gameData.price} onChange={handleInputChange} />
          </div>

          <div>
            <Label>Upload Image</Label>
            <DropzoneComponent onDrop={(files) => setGameData((prev) => ({ ...prev, image: files[0] }))} />
          </div>

          <div>
            <Label>Assets</Label>
            <DropzoneAnyComponent onDrop={(files) => setGameData((prev) => ({ ...prev, filepath: files[0] }))} />
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
