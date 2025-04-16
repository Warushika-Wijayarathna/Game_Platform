import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { updateInfoUsers } from "@/api/user.tsx";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert.tsx";

const PasswordModal = ({ onClose, onConfirm, updatedProfile }) => {
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleConfirm = async () => {
        console.log("Password entered:", password);
        const updateInfo = await updateInfoUsers({
            password: password,
            userInfo: updatedProfile, // Use the passed updatedProfile
        });
        console.log("Profile changes saved:", updateInfo);

        setShowAlert(true); // Show the alert

        // Delay closing the modal to allow the alert to be displayed
        setTimeout(() => {
            setShowAlert(false); // Hide the alert
            onClose(); // Close the modal
        }, 3000); // Adjust the delay as needed (e.g., 3 seconds)
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-800 rounded-lg p-6 w-full max-w-sm text-white"
            >
                <h2 className="text-xl font-bold mb-4">Confirm Password</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300"
                    >
                        Confirm
                    </button>
                </div>
            </motion.div>

            {showAlert && (
                <Alert variant="success" className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your changes have been saved successfully!</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default PasswordModal;
