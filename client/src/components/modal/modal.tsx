'use client';

interface ModalProps {
    onClose?: () => void;
    children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-transparent bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
                <div className="mt-">
                    <button
                        onClick={onClose}
                        className="absolute cursor-pointer top-1 right-2 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close modal"
                    >
                        X
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
}