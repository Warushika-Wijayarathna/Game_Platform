import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import { activateUser, deactivateUser, loadAllUsers, Users } from "../../../api/user.tsx";
import { UserTable } from "../../tables/BasicTables/BasicTable.tsx";
import Alert from "../../ui/alert/Alert";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

export default function UserForm() {
    const [users, setUsers] = useState<Users[]>([]);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | number | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await loadAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Error loading users:", error);
            setAlert({ type: "error", message: "Failed to load users." });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (alert) {
            const timeout = setTimeout(() => {
                setAlert(null);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [alert]);

    const handleDeactivateUser = (id: string | number): void => {
        setSelectedUserId(id);
        setIsDialogOpen(true);
    };

    const confirmDeactivation = async () => {
        if (selectedUserId === null) return;

        try {
            await deactivateUser(selectedUserId);
            setAlert({ type: "success", message: "User deactivated successfully." });
            fetchUsers();
        } catch (error) {
            console.error("Error deactivating user:", error);
            setAlert({ type: "error", message: "Failed to deactivate user." });
        } finally {
            setIsDialogOpen(false);
            setSelectedUserId(null);
        }
    };

    const handleActivateUser = async (id: string | number): Promise<void> => {
        try {
            await activateUser(id);
            setAlert({ type: "success", message: "User activated successfully." });
            fetchUsers();
        } catch (error) {
            console.error("Error activating user:", error);
            setAlert({ type: "error", message: "Failed to activate user." });
        }
    };

    return (
        <ComponentCard title="User Management">
            <div className="max-w-8xl mx-full">
                <div className="space-y-6">
                    {alert && (
                        <Alert
                            variant={alert.type}
                            title={alert.type === "success" ? "Success" : "Error"}
                            message={alert.message}
                            showLink={false}
                        />
                    )}
                    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                        <div className="max-w-full overflow-x-auto">
                            <UserTable
                                users={users}
                                onDeactivateUser={handleDeactivateUser}
                                onActivateUser={handleActivateUser}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
                <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl">
                        <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Confirm Deactivation
                        </DialogTitle>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to deactivate this user? This action cannot be undone.
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
