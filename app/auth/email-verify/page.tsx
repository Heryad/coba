'use client';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeContext';

export default function EmailVerifyPage() {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-2xl rounded-md ${isDark ? 'border-gray-700' : 'border'}`}>
        <div className={`${isDark ? 'bg-[#222]' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
          <div className="text-center">
            {/* Email Icon */}
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${isDark ? 'bg-[#009450]/20' : 'bg-[#009450]/10'}`}>
              <svg 
                className={`h-6 w-6 ${isDark ? 'text-[#009450]' : 'text-[#000]'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>

            <h2 className={`mt-6 text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Verify your email
            </h2>
            
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>

            <div className="mt-6 space-y-4">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Didn't receive the email? Check your spam folder or
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/auth"
                className={`text-sm font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                ← Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 