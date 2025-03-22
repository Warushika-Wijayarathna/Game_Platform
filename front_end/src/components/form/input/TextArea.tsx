import React from "react";

interface TextareaProps {
    placeholder?: string;
    rows?: number;
    value: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    hint?: string;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Updated type
}

const TextArea: React.FC<TextareaProps> = ({
                                               placeholder = "Enter your message",
                                               rows = 3,
                                               value = "",
                                               onChange = () => {}, // Default to an empty function
                                               className = "",
                                               disabled = false,
                                               error = false,
                                               hint = "",
                                               name = "",
                                           }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(e); // Pass the event object
        }
    };

    let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className} `;

    if (disabled) {
        textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed opacity40 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
        textareaClasses += ` bg-transparent  border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
    } else {
        textareaClasses += ` bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
    }

    return (
        <div className="relative">
            <textarea
                placeholder={placeholder}
                rows={rows}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className={textareaClasses}
                name={name}
            />
            {hint && (
                <p
                    className={`mt-2 text-sm ${
                        error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

export default TextArea;
