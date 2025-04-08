import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Button from "../../ui/button/Button";
import { saveCategory, loadAllCategories } from "../../../api/category.tsx";
import Form from "../Form.tsx";

interface Category {
    id: string;
    name: string;
    active: boolean;
}

export default function CategoryForm() {
    const [categoryData, setCategoryData] = useState<Category>({ id: "", name: "", active: true });
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await loadAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategoryData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await saveCategory(categoryData);
            setCategoryData({ id: "", name: "", active: true });
            const response = await loadAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    return (
        <ComponentCard title="Add New Category">
            <Form onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={categoryData.name}
                        onChange={handleInputChange}
                        placeholder="Enter category name"
                        required
                    />
                </div>
                <div className="text-right">
                    <Button size="sm" variant="primary" type="submit">
                        Save Category
                    </Button>
                </div>
            </Form>
        </ComponentCard>
    );
}
