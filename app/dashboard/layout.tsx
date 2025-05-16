"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOutAdmin, getSession, signInAdmin } from '@/app/utils/auth';
import {
  FolderIcon,
  ShoppingBagIcon,
  StarIcon,
  BellIcon,
  ShoppingCartIcon,
  UsersIcon,
  PhotoIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

const sidebarItems = [
  // Dashboard group
  {
    name: 'Analytics',
    path: '/dashboard',
    icon: <ChartBarIcon className="w-5 h-5" />
  },
  
  // Separator
  { isSeparator: true, name: 'Product Management' },
  
  // Product management group
  {
    name: 'Categories',
    path: '/dashboard/categories',
    icon: <FolderIcon className="w-5 h-5" />
  },
  {
    name: 'Products',
    path: '/dashboard/products',
    icon: <ShoppingBagIcon className="w-5 h-5" />
  },
  {
    name: 'Reviews',
    path: '/dashboard/reviews',
    icon: <StarIcon className="w-5 h-5" />
  },
  
  // Separator
  { isSeparator: true, name: 'Content' },
  
  // Content management group
  {
    name: 'Social Posts',
    path: '/dashboard/social-posts',
    icon: <BellIcon className="w-5 h-5" />
  },
  {
    name: 'Image Upload',
    path: '/dashboard/images',
    icon: <PhotoIcon className="w-5 h-5" />
  },
  
  // Separator
  { isSeparator: true, name: 'Commerce' },
  
  // Order management group
  {
    name: 'Orders',
    path: '/dashboard/orders',
    icon: <ShoppingCartIcon className="w-5 h-5" />
  },
  {
    name: 'Payment Methods',
    path: '/dashboard/payment-method',
    icon: <CreditCardIcon className="w-5 h-5" />
  },
  
  // Separator
  { isSeparator: true, name: 'Users' },
  
  // User management group
  {
    name: 'Users',
    path: '/dashboard/users',
    icon: <UsersIcon className="w-5 h-5" />
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await getSession();
      setIsLoggedIn(!!session);
      
      // Extract username from session based on the actual structure
      if (session && session.admin) {
        setUsername(session.admin.username || '');
      }
    } catch (error) {
      console.error('Session check error:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Get initials from username
  const getUserInitials = () => {
    if (!username) return '';
    
    return username
      .split(' ')
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      {isLoggedIn ? <>
        <div className="fixed inset-0 bg-white z-50 flex">
          {/* Sidebar */}
          <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col h-full">
            <div className="p-5 border-b border-gray-700 flex items-center justify-center">
              <h1 className="text-xl font-bold">Coba's Admin</h1>
            </div>
            <nav className="flex-grow overflow-y-auto py-6 px-2">
              <ul className="space-y-1.5">
                {sidebarItems.map((item, index) => {
                  // If it's a separator, render a separator
                  if ('isSeparator' in item) {
                    return (
                      <li key={`separator-${index}`} className="pt-4 pb-2">
                        <div className="px-4 flex items-center">
                          <div className="h-px bg-gray-700 flex-grow"></div>
                          {item.name && (
                            <span className="px-2 text-xs font-semibold text-gray-500 uppercase">
                              {item.name}
                            </span>
                          )}
                          <div className="h-px bg-gray-700 flex-grow"></div>
                        </div>
                      </li>
                    );
                  }
                  
                  // Otherwise render a regular navigation item
                  const isActive = pathname === item.path;
                  return (
                    <li key={item.path || index}>
                      <Link
                        href={item.path || '#'}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                            ? 'bg-[#009450] text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                      >
                        <span className={`${isActive ? 'text-white' : 'text-gray-400'} mr-3`}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <span className="ml-auto bg-white bg-opacity-20 h-2 w-2 rounded-full"></span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-sm bg-red-600 hover:bg-red-700 transition-colors duration-200 rounded-lg flex items-center justify-center font-medium"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-sm py-4 px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {sidebarItems.find(item => !('isSeparator' in item) && item.path === pathname)?.name || 'Dashboard'}
                </h2>
                <div className="flex items-center space-x-3">
                  <div className="px-8 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                    <UserCircleIcon className="w-5 h-5 mr-2"/>
                    {getUserInitials()}
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </> : <>
        <LoginForm onSuccess={() => setIsLoggedIn(true)} />
      </>}
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signInAdmin(email, password);
      console.log('Login result:', result);
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-1/5">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#009450] bg-opacity-10 mb-4">
            <svg className="w-8 h-8 text-[#009450]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard Login</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#009450]"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#009450]"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#009450] text-white py-2.5 px-4 rounded-md hover:bg-[#009450]/90 transition-colors duration-200 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

