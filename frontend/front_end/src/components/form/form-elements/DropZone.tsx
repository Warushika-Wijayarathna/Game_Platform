import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";

interface DropzoneComponentProps {
    onDrop: (file: File[]) => void;
    accept?: string;
    id?: string;
    reset?: boolean; // New prop to reset the dropzone
}

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({ onDrop, reset }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setFileName(acceptedFiles[0].name); // Store the first file's name
            }
            onDrop(acceptedFiles);
        },
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/webp": [],
            "image/svg+xml": [],
        },
        maxFiles: 1, // Only allow one file
    });

    // Reset the dropzone when the reset prop changes
    useEffect(() => {
        if (reset) {
            setFileName(null);
        }
    }, [reset]);

    return (
        <div
            className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500"
        >
            <form
                {...getRootProps()}
                className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
                    ${
                    isDragActive
                        ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                        : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                }
                `}
                id="demo-upload"
            >
                <input {...getInputProps()} />

                <div className="dz-message flex flex-col items-center m-0!">
                    {fileName ? (
                        <div className="text-center">
                            <div className="mb-3 text-gray-800 dark:text-white">
                                <span className="font-semibold">Uploaded:</span>
                            </div>
                            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {fileName}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="mt-3 text-sm text-brand-500 underline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFileName(null);
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <>
                            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                                {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
                            </h4>
                            <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                                Drag and drop your PNG, JPG, WebP, SVG images here or browse
                            </span>
                            <span className="font-medium underline text-theme-sm text-brand-500">
                                Browse File
                            </span>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default DropzoneComponent;
