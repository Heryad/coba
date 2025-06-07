'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';

export default function AuthPage() {
    const { signIn, signUp, signInWithGoogle, user } = useAuth();
    const router = useRouter();
    const [isSignIn, setIsSignIn] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { isDark } = useTheme();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });

    useEffect(() => {
        // Redirect if user is already authenticated
        if (user) {
            router.push('/');
        }
        // Add animation delay
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, [user, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isSignIn) {
                await signIn(formData.email, formData.password);
            } else {
                await signUp(formData.email, formData.password, formData.username);
            }
        } catch (error) {
            console.error('Authentication error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Google sign-in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {isSignIn ? 'Sign in to your account' : 'Create your account'}
                </h2>
                <p className={`mt-2 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isSignIn ? (
                        <>
                            Or{' '}
                            <button
                                onClick={() => setIsSignIn(false)}
                                className={`font-bold ${isDark ? 'text-white hover:text-gray-200' : 'text-[#000] hover:text-black/80'}`}
                            >
                                create a new account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button
                                onClick={() => setIsSignIn(true)}
                                className={`font-bold ${isDark ? 'text-white hover:text-gray-200' : 'text-[#000] hover:text-black/80'}`}
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </p>
            </div>

            <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className={`${isDark ? 'bg-[#222] border border-gray-700' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isSignIn && (
                            <div>
                                <label htmlFor="username" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#009450] focus:border-[#009450] sm:text-sm ${
                                            isDark 
                                                ? 'bg-gray-800 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#009450] focus:border-[#009450] sm:text-sm ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#009450] focus:border-[#009450] sm:text-sm ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant='primary'
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isSignIn ? 'Signing in...' : 'Creating account...'}
                                    </div>
                                ) : (
                                    isSignIn ? 'Sign in' : 'Create account'
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`} />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={`px-2 ${isDark ? 'bg-[#222] text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${
                                    isDark 
                                        ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' 
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${isDark ? 'text-gray-200' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in with Google...
                                    </div>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                            />
                                        </svg>
                                        Sign in with Google
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 