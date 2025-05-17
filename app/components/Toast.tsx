'use client'

import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Toast() {
    const { toasts, removeToast } = useToast();
    const [isVisible, setIsVisible] = useState(false);

    // CSS keyframes for entry animation
    const animationStyles = `
        @keyframes slideInFromBottom {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    useEffect(() => {
        if (toasts.length > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [toasts]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col-reverse gap-2">
            {/* Add keyframe styles */}
            <style>{animationStyles}</style>

            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`min-w-[300px] p-4 rounded-md shadow-lg transform
                        ${toast.type === 'success' ? 'bg-[#000]' : 
                          toast.type === 'error' ? 'bg-red-500' : 
                          'bg-blue-500'} 
                        text-white
                    `}
                    style={{ animation: 'slideInFromBottom 0.3s ease-out forwards' }} // Apply animation
                >
                    <div className="flex items-center justify-between">
                        <p className="font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 text-white hover:text-gray-200 transition-colors"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
} 