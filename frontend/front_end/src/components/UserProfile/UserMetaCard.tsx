import { useEffect, useState } from "react";
        import { useModal } from "../../hooks/useModal";
        import { getUser, updateUser, Users } from "../../api/user";
        import { Modal } from "../ui/modal";
        import Alert from "../ui/alert/Alert";

        export default function UserMetaCard() {
          const { isOpen, openModal, closeModal } = useModal();
          const [user, setUser] = useState<Users | null>(null);
          const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | "info"; message: string } | null>(null);
          useEffect(() => {
            const fetchUser = async () => {
              try {
                const fetchedUser = await getUser();
                setUser(fetchedUser);
              } catch (error) {
                console.error("Error fetching user:", error);
              }
            };
            fetchUser();
          }, []);

          async function handleSave() {
            try {
              const updatedUser = {
                ...user,
                name: user?.name,
              };
              await updateUser(updatedUser);
              setAlert({ type: "success", message: "User updated successfully!" });
            } catch (error) {
              console.error("Error updating user:", error);
              setAlert({ type: "error", message: "Failed to update user. Please try again." });
            }

            setTimeout(() => setAlert(null), 3000); // Hide alert after 3 seconds
          }

          return (
            <>
              {alert && (
                <Alert
                  variant={alert.type}
                  title={alert.type === "success" ? "Success" : "Error"}
                  message={alert.message}
                />
              )}
              <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                    <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                      <img src="/images/user/owner.jpg" alt="user" />
                    </div>
                    <div className="order-3 xl:order-2">
                      <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                        {user ? user.name : "Loading..."}
                      </h4>
                      <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user ? user.role : "Loading..."}
                        </p>
                        <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                      </div>
                    </div>
                    <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                      {/* Social links */}
                    </div>
                  </div>
                  <button
                    onClick={openModal}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                  >
                    Edit
                  </button>
                </div>
              </div>
              <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-900">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Edit Username
                  </h2>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    onChange={(e) => setUser({ ...user, name: e.target.value } as Users)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 p-2"
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleSave();
                        closeModal();
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Modal>
            </>
          );
        }
