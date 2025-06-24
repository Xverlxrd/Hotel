'use client';

import { useState, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    variant?: 'outline' | 'filled' | 'flushed';
}

export default function Input({
                                  label,
                                  error,
                                  variant = 'outline',
                                  className = '',
                                  ...props
                              }: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const variants = {
        outline: 'border-2 border-gray-300 focus:border-blue-500 bg-transparent',
        filled: 'bg-gray-100 focus:bg-white border-b-2 border-gray-300 focus:border-blue-500',
        flushed: 'border-b-2 border-gray-300 focus:border-blue-500 bg-transparent rounded-none',
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    className={`block mb-1 text-sm font-medium transition-all duration-200 ${
                        isFocused ? 'text-blue-600' : 'text-gray-700'
                    } ${error ? 'text-red-500' : ''}`}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    {...props}
                    className={`w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        variants[variant]
                    } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                />

                {error && (
                    <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}