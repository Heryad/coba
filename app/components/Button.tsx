'use client'

import { ButtonHTMLAttributes } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'size';
  isLoading?: boolean;
  isSelected?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  isSelected = false,
  className = '',
  ...props
}: ButtonProps) {
  const { isDark } = useTheme();

  const baseStyles = 'flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50';
  
  const variantStyles = {
    primary: `${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`,
    secondary: `${isDark ? 'border border-white text-white hover:bg-gray-800' : 'border border-black text-black hover:bg-gray-100'}`,
    size: `rounded-lg transform hover:scale-105 ${
      isSelected
        ? isDark
          ? 'bg-white text-black border-white'
          : 'bg-black text-white border-black'
        : isDark
          ? 'bg-[#333] text-gray-200 border-gray-600 hover:bg-[#444]'
          : 'bg-gray-100 text-gray-900 border-transparent hover:bg-gray-200'
    }`
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
} 