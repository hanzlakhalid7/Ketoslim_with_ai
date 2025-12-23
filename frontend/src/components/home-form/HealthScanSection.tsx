import { ChangeEvent } from 'react';

interface HealthScanSectionProps {
    previewUrl: string | null;
    isLoading: boolean;
    onClear: () => void;
    onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
    onCameraClick: () => void;
    mode: boolean;
}

const HealthScanSection = ({ previewUrl, isLoading, onClear, onFileSelect, onCameraClick, mode }: HealthScanSectionProps) => {
    return (
        <div className="w-full text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Auto-Fill with Health Scan</h2>
            <p className={`mb-4 ${!mode ? 'text-gray-600' : 'text-gray-300'}`}>
                Upload an image or take a photo to automatically fill the form below.
            </p>

            {previewUrl ? (
                <div className="relative w-full max-w-sm mx-auto mb-6">
                    <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-xl shadow-md border border-gray-200" />
                    <button
                        onClick={onClear}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow hover:bg-red-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex gap-4 justify-center w-full">
                    {/* Upload Box */}
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-500 transition-colors flex-1 flex flex-col items-center justify-center cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isLoading}
                        />
                        <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <span className="font-semibold text-sm">Upload File</span>
                    </div>

                    {/* Camera Button */}
                    <div onClick={onCameraClick} className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-500 transition-colors flex-1 flex flex-col items-center justify-center cursor-pointer">
                        <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-sm">Take Photo</span>
                    </div>
                </div>
            )}

            {isLoading && <div className="mt-4 font-semibold animate-pulse text-red-500">Analyzing Image...</div>}
        </div>
    );
};

export default HealthScanSection;
