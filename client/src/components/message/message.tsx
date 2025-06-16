'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageProps {
    text: string;
    type?: 'success' | 'error' | 'warning';
    duration?: number;
    onClose?: () => void;
}

export default function Message({
                                    text,
                                    type = 'success',
                                    duration = 3000,
                                    onClose
                                }: MessageProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        success: {
            bg: 'bg-green-50',
            text: 'text-green-800',
            border: 'border-green-200',
            dot: 'bg-green-500'
        },
        error: {
            bg: 'bg-red-50',
            text: 'text-red-800',
            border: 'border-red-200',
            dot: 'bg-red-500'
        },
        warning: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-800',
            border: 'border-yellow-200',
            dot: 'bg-yellow-500'
        }
    };

    const currentStyle = typeStyles[type];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className={`fixed top-4 right-4 z-50 ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} border rounded-lg shadow-lg p-4 w-64 flex items-start gap-3`}
                >
                    <div className={`h-3 w-3 rounded-full mt-1 flex-shrink-0 ${currentStyle.dot}`} />
                    <div className="flex-1 text-sm">{text}</div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 cursor-pointer hover:text-gray-600 ml-2"
                        aria-label="Close message"
                    >
                        &times;
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}