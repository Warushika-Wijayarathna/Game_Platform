import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Button from "../../ui/button/Button";
import Form from "../Form.tsx";
import { saveUser, loadAllUsers } from "../../../api/user.tsx";

interface User {
    uid: string;
    name: string;
    email: string;
    role: string;
}

export default function UserForm() {
    const [users, setUsers] = useState<User[]>([]);
    const [userData, setUserData] = useState<User>({
        uid: "",
        name: "",
        email: "",
        role: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await loadAllUsers();
                setUsers(response.data);
            } catch (error) {
                console.error("Error loading users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await saveUser(userData);
            setUserData({ uid: "", name: "", email: "", role: "" });

            const response = await loadAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Error saving user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ComponentCard title="Add New User">
            <Form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        placeholder="Enter user name"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        placeholder="Enter user email"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                        type="text"
                        id="role"
                        name="role"
                        value={userData.role}
                        onChange={handleInputChange}
                        placeholder="Enter user role"
                        required
                    />
                </div>
                <div className="text-right">
                    <Button size="sm" variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save User"}
                    </Button>
                </div>
            </Form>
        </ComponentCard>
    );
}
