import { useState } from "react";

interface ChatUiProps {
    donorId?: number | null;
    onClose?: () => void;
}

export default function ChatUi({ donorId, onClose }: ChatUiProps) {
    const [messages, setMessages] = useState([
        {
            type: "bot", text: "This is a response from the chatbot."

        },
    ]);
    const [userInput, setUserInput] = useState("");

    const handleSendMessage = () => {
        if (userInput.trim() !== "") {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    type: "user",
                    text: userInput
                },
            ]);
            setUserInput("");
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: "bot", text: "This is a response from the chatbot." },
                ]);
            }, 500);
        }
    };

    return (
        <div className="fixed bottom-16 right-4 w-96">
            <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
                <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
                    <p className="text-lg font-semibold">{donorId}</p>
                    <button
                        onClick={onClose} // Trigger the onClose function
                        className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="p-4 h-80 overflow-y-auto">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-2 ${
                                message.type === "user" ? "text-right" : ""
                            }`}
                        >
                            <p
                                className={`${
                                    message.type === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700"
                                } rounded-lg py-2 px-4 inline-block`}
                            >
                                {message.text}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t flex">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type a message"
                        className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
