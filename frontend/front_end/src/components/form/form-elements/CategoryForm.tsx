import { useState, useEffect } from "react";
    import ComponentCard from "../../common/ComponentCard";
    import Label from "../Label";
    import Input from "../input/InputField";
    import Button from "../../ui/button/Button";
    import { saveCategory, loadAllCategories, updateCategory, Category, deactivateCategory } from "../../../api/category.tsx";
    import Form from "../Form.tsx";
    import Checkbox from "../input/Checkbox";
    import { CategoryTable } from "../../tables/BasicTables/BasicTable";
    import Alert from "../../ui/alert/Alert";
    import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

    export default function CategoryForm() {
        const [categories, setCategories] = useState<Category[]>([]);
        const [categoryData, setCategoryData] = useState<Category>({
            id: 0,
            name: "",
            active: false
        });
        const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
        const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [categoryToDeactivate, setCategoryToDeactivate] = useState<number | null>(null);

        useEffect(() => {
            fetchCategories();
        }, []);

        useEffect(() => {
            if (alert) {
                const timer = setTimeout(() => {
                    setAlert(null); // Clear the alert after 5 seconds
                }, 5000);

                return () => clearTimeout(timer); // Cleanup the timer on component unmount or alert change
            }
        }, [alert]);

        const fetchCategories = async () => {
            try {
                const response = await loadAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setCategoryData(prev => ({ ...prev, [name]: value }));
        };

        const handleCheckboxChange = (checked: boolean) => {
            setCategoryData(prev => ({ ...prev, active: checked }));
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                if (editingCategoryId !== null) {
                    await updateCategory(editingCategoryId.toString(), categoryData);
                    setAlert({ type: "success", message: "Category updated successfully!" });
                } else {
                    await saveCategory(categoryData);
                    setAlert({ type: "success", message: "Category added successfully!" });
                }

                setCategoryData({ id: 0, name: "", active: false });
                setEditingCategoryId(null);
                await fetchCategories();
            } catch (error) {
                setAlert({ type: "error", message: "Error saving category. Please try again." });
            }
        };

        const handleEditCategory = (category: Category) => {
            setEditingCategoryId(category.id);
            setCategoryData({ id: category.id, name: category.name, active: category.active });
        };

        const handleDeactivateCategory = (id: number) => {
            setCategoryToDeactivate(id);
            setIsDialogOpen(true);
        };

        const confirmDeactivation = async () => {
            if (categoryToDeactivate !== null) {
                try {
                    await deactivateCategory(categoryToDeactivate);
                    setAlert({ type: "success", message: "Category deactivated successfully!" });
                    await fetchCategories();
                } catch (error) {
                    setAlert({ type: "error", message: "Error deactivating category. Please try again." });
                } finally {
                    setIsDialogOpen(false);
                    setCategoryToDeactivate(null);
                }
            }
        };

        return (
            <ComponentCard title="Manage Categories">
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
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={categoryData.name || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter category name"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="active"
                                        checked={categoryData.active || false}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Label htmlFor="active">Active</Label>
                                </div>

                                <div className="text-right">
                                    <Button size="sm" variant="primary" type="submit">
                                        {editingCategoryId ? "Update Category" : "Add Category"}
                                    </Button>
                                </div>
                            </div>

                            <div className="col-span-3 space-y-6">
                                <CategoryTable
                                    categories={categories}
                                    onEditCategory={handleEditCategory}
                                    onDeactivateCategory={handleDeactivateCategory}
                                />
                            </div>
                        </div>
                    </Form>
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
                                    Are you sure you want to deactivate this category? This action cannot be undone.
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
            </ComponentCard>
        );
    }
