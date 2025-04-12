import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";

interface DropzoneAnyComponentProps {
    onDrop: (files: File[]) => Promise<void>; // Changed to async
}

interface ExtendedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    webkitdirectory?: string;
    mozdirectory?: string;
    directory?: string;
}

const DropzoneAnyComponent: React.FC<DropzoneAnyComponentProps> = ({ onDrop }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length === 0) return;

            setIsUploading(true);
            setUploadProgress(0);

            // Simulate upload progress (replace with your actual upload logic)
            const totalSteps = 100;
            for (let i = 0; i <= totalSteps; i++) {
                await new Promise(resolve => setTimeout(resolve, 30));
                setUploadProgress(i);
            }

            try {
                await onDrop(acceptedFiles);
            } catch (error) {
                console.error("Upload failed:", error);
            } finally {
                setIsUploading(false);
            }
        },
        accept: undefined,
        disabled: isUploading,
    });

    const inputProps = getInputProps() as ExtendedInputProps;
    inputProps.webkitdirectory = "";
    inputProps.mozdirectory = "";
    inputProps.directory = "";

    return (
        <ComponentCard title="Dropzone (Folders Accepted)">
            <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                <form
                    {...getRootProps()}
                    className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 relative ${
                        isDragActive
                            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                    } ${isUploading ? "opacity-70" : ""}`}
                    id="demo-upload"
                >
                    <input {...inputProps} />

                    {/* Progress Bar */}
                    {isUploading && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
                            <div
                                className="h-full bg-brand-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}

                    <div className="dz-message flex flex-col items-center m-0!">
                        {/* Icon Container */}
                        <div className="mb-[22px] flex justify-center">
                            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
                                ) : (
                                    <svg
                                        className="fill-current"
                                        width="29"
                                        height="28"
                                        viewBox="0 0 29 28"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Text Content */}
                        <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                            {isUploading
                                ? `Uploading... ${uploadProgress}%`
                                : isDragActive
                                    ? "Drop Folder Here"
                                    : "Drag & Drop Folder Here"}
                        </h4>

                        {!isUploading && (
                            <>
                                <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                                    Drag and drop a folder here or browse to select a folder
                                </span>
                                <span className="font-medium underline text-theme-sm text-brand-500">
                                    Browse Folder
                                </span>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </ComponentCard>
    );
};

export default DropzoneAnyComponent;
