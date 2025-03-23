import { useState, useEffect } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../../context/ThemeContext.tsx";
import { saveCategory, loadAllCategories } from "../../../api/category.tsx";
import Form from "../Form.tsx";
import Checkbox from "../input/Checkbox"; // Assuming you have a Checkbox component

export default function GameForm() {
  const { theme } = useTheme();
  const [gameData, setGameData] = useState({
    name: "",
    description: "",
    category: "",
    rules: "",
    price: "",
    image: null as File | null,
    filepath: null as File | null,
    active: true, // Default to true
    uploadedBy: "user123", // Replace with actual logged-in user ID
  });

  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await loadAllCategories();
        console.log("API Response:", response);

        // Ensure response.data is defined, or default to an empty array
        const formattedCategories = (response.data || []).map((category) => ({
          value: category.name,
          label: category.name,
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setGameData((prev) => ({ ...prev, category: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setGameData((prev) => ({ ...prev, active: checked }));
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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory = (e.target as HTMLFormElement).newCategory.value;
    if (newCategory) {
      try {
        const savedCategory = await saveCategory({ name: newCategory, active: true });
        console.log("Category saved successfully:", savedCategory);
        setShowModal(false);

        // Refresh the categories list after adding a new category
        const response = await loadAllCategories();
        const formattedCategories = response.data.map((category) => ({
          value: category.name,
          label: category.name,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error saving category:", error);
        alert("Failed to save category. Please try again.");
      }
    }
  };

  return (
      <ComponentCard title="Add New Game">
        {/* Increase the width of the form container */}
        <div className="max-w-4xl mx-auto"> {/* Adjust max-w-4xl to your desired width */}
          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* Use a grid container to create two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Game Name</Label>
                  <Input
                      type="text"
                      id="name"
                      name="name"
                      value={gameData.name}
                      onChange={handleInputChange}
                      placeholder="Enter game name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <TextArea
                      rows={4}
                      name="description"
                      value={gameData.description}
                      onChange={handleInputChange}
                      placeholder="Enter game description"
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
                    >
                      <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                    </Button>
                  </div>
                  <Select
                      options={categories}
                      value={gameData.category}
                      placeholder="Select Category"
                      onChange={handleSelectChange}
                  />
                </div>

                <div>
                  <Label htmlFor="rules">Rules</Label>
                  <TextArea
                      rows={4}
                      name="rules"
                      value={gameData.rules}
                      onChange={handleInputChange}
                      placeholder="Enter game rules"
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
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
                  <Label>Upload Image</Label>
                  <DropzoneComponent
                      onDrop={(files) =>
                          setGameData((prev) => ({ ...prev, image: files[0] }))
                      }
                  />
                </div>

                <div>
                  <Label>Assets</Label>
                  <DropzoneAnyComponent
                      onDrop={(files) =>
                          setGameData((prev) => ({ ...prev, filepath: files[0] }))
                      }
                  />
                </div>

                <div>
                  <Label htmlFor="active">Active</Label>
                  <Checkbox
                      id="active"
                      checked={gameData.active}
                      onChange={handleCheckboxChange} // Pass the function directly
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="text-right">
              <Button size="sm" variant="primary">
                Save Game
              </Button>
            </div>
          </Form>
        </div>

        {/* Modal for adding a new category */}
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
                    <Input type="text" id="newCategory" name="newCategory" />
                  </div>
                  <div className="text-right">
                    <Button size="sm" variant="primary">
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
