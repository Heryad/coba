'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/context/DataProvider';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';
import CartDropdown from './CartDropdown';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/app/context/ThemeContext';
import { useLanguage } from '@/app/context/LanguageContext';


export default function Navbar() {
  const { data } = useData();
  const { cartItems } = useCart();
  const { user, signOut } = useAuth();
  const { isDark } = useTheme();
  const { translations } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shopBtnRef = useRef<HTMLButtonElement>(null);
  const cartBtnRef = useRef<HTMLButtonElement>(null);
  const mobileCartBtnRef = useRef<HTMLButtonElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageBtnRef = useRef<HTMLButtonElement>(null);
  const { currentLanguage, changeLanguage } = useLanguage();

  // Move languageFlags outside the component
  const languageFlags: { [key: string]: string } = {
    en: "🇺🇸",
    am: "🇪🇹"
  };

  // Add useEffect to handle initial language state
  useEffect(() => {
    // This ensures the language state is properly synced after hydration
    const savedLanguage = localStorage.getItem('preferred_language') || 'en';
    if (currentLanguage !== savedLanguage) {
      changeLanguage(savedLanguage);
    }
  }, []);

  // Helper function to get translations
  const t = (key: string) => {
    const value = key.split('.').reduce((o, i) => o?.[i], translations);
    return (typeof value === 'string' ? value : key) as string;
  };

  // Update active states when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');

    if (category) {
      setActiveCategory(category.toLowerCase());
      setActiveSubcategory(subcategory?.toLowerCase() || null);

      // Find and set the open category
      const matchingCategory = data.categories.find(
        cat => cat.category_name.toLowerCase() === category.toLowerCase()
      );
      if (matchingCategory) {
        setOpenCategoryId(matchingCategory.id);
      }
    } else {
      setActiveCategory(null);
      setActiveSubcategory(null);
      setOpenCategoryId(null);
    }
  }, [pathname, data.categories]);

  // Check if current path matches
  const isActive = (path: string, category?: string, subcategory?: string) => {
    if (pathname !== path) return false;

    if (category) {
      if (subcategory) {
        return activeCategory === category && activeSubcategory === subcategory;
      }
      return activeCategory === category;
    }

    return true;
  };

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        shopBtnRef.current &&
        !shopBtnRef.current.contains(event.target as Node)
      ) {
        setIsShopDropdownOpen(false);
      }

      if (
        cartBtnRef.current &&
        !cartBtnRef.current.contains(event.target as Node) &&
        !mobileCartBtnRef.current?.contains(event.target as Node) &&
        !(event.target as Element).closest('.cart-dropdown')
      ) {
        setIsCartDropdownOpen(false);
      }

      if (
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.profile-dropdown')
      ) {
        setIsProfileDropdownOpen(false);
      }

      if (
        languageBtnRef.current &&
        !languageBtnRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.language-dropdown')
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("Cart Dropdown is now:", isCartDropdownOpen);
  }, [isCartDropdownOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
          isDark 
            ? 'bg-[#222] text-white'
            : hasScrolled 
              ? 'bg-[#222] text-white'
              : 'bg-white'
        }`}
    >
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className={`text-2xl font-bold ${isDark || hasScrolled ? 'text-white' : 'text-gray-900'}`}>
              Coba
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-8">

            {/* Shop Dropdown - Using hover on desktop */}
            <div className="relative flex space-x-4">
              {data.categories.map((category) => (
                <div key={category.id} className="relative inline-block">
                  <button
                    ref={shopBtnRef}
                    onClick={() => {
                      setOpenCategoryId(openCategoryId === category.id ? null : category.id);
                      setIsShopDropdownOpen(!isShopDropdownOpen);
                    }}
                    onMouseEnter={() => {
                      setOpenCategoryId(category.id);
                      setIsShopDropdownOpen(true);
                    }}
                    className={`inline-flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                      isActive('/shop', category.category_name.toLowerCase())
                        ? isDark || hasScrolled 
                          ? 'border-white text-white' 
                          : 'border-black text-gray-900'
                        : isDark || hasScrolled
                          ? 'border-transparent text-gray-300 hover:text-white hover:border-white/60'
                          : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'
                    }`}
                  >
                    {category.category_name}
                    {category.sub_categories?.length > 0 && (
                      <svg
                        className={`ml-1 h-5 w-5 transition-transform duration-200 ${openCategoryId === category.id ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Individual Category Dropdown */}
                  {openCategoryId === category.id && (
                    <div
                      ref={dropdownRef}
                      onMouseLeave={() => {
                        setIsShopDropdownOpen(false);
                        setOpenCategoryId(null);
                      }}
                      className={`absolute left-0 mt-2 z-20 transition-all duration-300 ${
                        isShopDropdownOpen
                          ? 'opacity-100 visible'
                          : 'opacity-0 invisible pointer-events-none'
                      }`}
                    >
                      <div className={`w-64 shadow-xl rounded-md overflow-hidden ${isDark ? 'bg-[#333]' : 'bg-white'}`}>
                        <div className={`px-4 py-3 text-xs uppercase tracking-wider font-semibold border-b ${
                          isDark ? 'text-gray-300 border-gray-600' : 'text-gray-500 border-gray-100'
                        }`}>
                          {category.category_name}
                        </div>
                        <div className="py-2">
                          {category.sub_categories?.map((subcat) => (
                            <Link
                              key={subcat}
                              href={`/shop?category=${category.category_name.toLowerCase()}&subcategory=${subcat.toLowerCase()}`}
                              onClick={() => {
                                setIsShopDropdownOpen(false);
                                setOpenCategoryId(null);
                              }}
                              className={`block px-4 py-2.5 text-sm ${
                                isActive('/shop', category.category_name.toLowerCase(), subcat.toLowerCase())
                                  ? isDark
                                    ? 'bg-[#444] text-white'
                                    : 'bg-gray-100 text-gray-900'
                                  : isDark
                                    ? 'text-gray-300 hover:bg-[#444] hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              {subcat}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/track-order"
              className={`inline-flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                isActive('/track-order')
                  ? isDark || hasScrolled 
                    ? 'border-white text-white' 
                    : 'border-black text-gray-900'
                  : isDark || hasScrolled
                    ? 'border-transparent text-gray-300 hover:text-white hover:border-white/60'
                    : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {t('navigation.trackOrder')}
            </Link>

            <Link
              href="/ambassador"
              className={`inline-flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                isActive('/ambassador')
                  ? isDark || hasScrolled 
                    ? 'border-white text-white' 
                    : 'border-black text-gray-900'
                  : isDark || hasScrolled
                    ? 'border-transparent text-gray-300 hover:text-white hover:border-white/60'
                    : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {t('navigation.ambassador')}
            </Link>

            {/* Search, Language, Login and Cart */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggle />

              

              {/* Search */}
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder={t('navigation.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                      isDark || hasScrolled
                        ? 'bg-[#333] border-gray-600 text-white placeholder-gray-400 focus:ring-white/60'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-black/60'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className={`h-5 w-5 ${isDark || hasScrolled ? 'text-gray-400' : 'text-gray-500'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>

              {/* Login/Profile */}
              {user ? (
                <div className="relative">
                  <button
                    ref={profileBtnRef}
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isDark || hasScrolled 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      {user.photo_url ? (
                        <img
                          src={user.photo_url}
                          alt={user.username || t('navigation.profile')}
                          className="h-8 w-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className={`h-8 w-8 rounded-full mr-2 flex items-center justify-center ${
                          isDark || hasScrolled ? 'bg-[#444]' : 'bg-gray-100'
                        }`}>
                          <svg className={`h-5 w-5 ${isDark || hasScrolled ? 'text-gray-300' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <span>{user.username || ''}</span>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="profile-dropdown absolute right-0 mt-2 w-48 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className={`py-1 ${isDark ? 'bg-[#333]' : 'bg-white'}`} role="menu" aria-orientation="vertical">
                        <Link
                          href="/profile?tab=profile"
                          className={`block px-4 py-2 text-sm ${
                            isDark 
                              ? 'text-gray-300 hover:bg-[#444] hover:text-white' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          role="menuitem"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          {t('profile.tabs.profile')}
                        </Link>
                        <Link
                          href="/profile?tab=orders"
                          className={`block px-4 py-2 text-sm ${
                            isDark 
                              ? 'text-gray-300 hover:bg-[#444] hover:text-white' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          role="menuitem"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          {t('profile.tabs.orders')}
                        </Link>
                        <button
                          onClick={() => {

                            signOut();
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            isDark 
                              ? 'text-red-400 hover:bg-[#444] hover:text-red-300' 
                              : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                          }`}
                          role="menuitem"
                        >
                          {t('navigation.signOut')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/auth" 
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isDark || hasScrolled 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <svg className={`h-5 w-5 mr-1 ${isDark || hasScrolled ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('navigation.signIn')}
                </Link>
              )}

              {/* Cart */}
              <div className="relative">
                <button
                  ref={cartBtnRef}
                  onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${hasScrolled ? 'text-white hover:text-white/80' : 'text-gray-200 hover:text-[#000]'
                    }`}
                >
                  <svg className={`h-5 w-5 mr-1 ${hasScrolled ? 'text-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown */}
                {isCartDropdownOpen && (
                  <div className="cart-dropdown">
                    <CartDropdown onAction={() => { setIsCartDropdownOpen(false) }} />
                  </div>
                )}
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  ref={languageBtnRef}
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isDark || hasScrolled 
                      ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {/* Use a client-side only wrapper for the flag */}
                  <span className="mr-2 text-lg" suppressHydrationWarning>
                    {languageFlags[currentLanguage] || languageFlags['en']}
                  </span>
                  <span suppressHydrationWarning>
                    {currentLanguage.toUpperCase()}
                  </span>
                  <svg
                    className={`ml-2 h-5 w-5 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Language Dropdown */}
                {isLanguageDropdownOpen && (
                  <div className="language-dropdown absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50">
                    <div className={`py-1 rounded-md ${isDark ? 'bg-[#333] ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'}`}>
                      <div className={`px-4 py-2 text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('languages.switchLanguage')}
                      </div>
                      {Object.entries(languageFlags).map(([lang, flag]) => (
                        <button
                          key={lang}
                          onClick={() => {
                            changeLanguage(lang);
                            setIsLanguageDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 ${
                            currentLanguage === lang
                              ? isDark
                                ? 'bg-[#444] text-white'
                                : 'bg-gray-100 text-gray-900'
                              : isDark
                                ? 'text-gray-300 hover:bg-[#444] hover:text-white'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <span className="text-lg">{flag}</span>
                          <span>{t(`languages.${lang}`)}</span>
                          {currentLanguage === lang && (
                            <svg className="ml-auto h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-4">
            {/* Mobile Theme Toggle */}
            <div className={`p-2 rounded-full ${isDark || hasScrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
              <ThemeToggle />
            </div>
            {/* Mobile Cart */}
            <div className="relative">
              <button
                ref={mobileCartBtnRef}
                onClick={() => { setIsCartDropdownOpen(isCartDropdownOpen ? false : true) }}
                className={`relative p-2 rounded-full ${hasScrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <svg
                  className={`h-5 w-5 ${hasScrolled ? 'text-white' : 'text-gray-500'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Mobile Cart Dropdown */}
              {isCartDropdownOpen && (
                <div className="cart-dropdown">
                  <CartDropdown onAction={() => { setIsCartDropdownOpen(false) }} />
                </div>
              )}
            </div>

            

            {/* Hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${hasScrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''} ${hasScrolled ? 'text-white' : 'text-gray-500'
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isDark ? 'bg-[#2A2A2A]' : 'bg-white'} ${isMobileMenuOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
        <nav className={`px-4 pt-2 pb-3 space-y-1 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Language Switcher for Mobile */}
          <div className="px-3 py-2">
            <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('languages.switchLanguage')}
            </div>
            <div className="flex space-x-2">
              {Object.entries(languageFlags).map(([lang, flag]) => (
                <button
                  key={lang}
                  onClick={() => {
                    changeLanguage(lang);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    currentLanguage === lang
                      ? isDark
                        ? 'bg-[#444] text-white'
                        : 'bg-gray-100 text-gray-900'
                      : isDark
                        ? 'text-gray-300 hover:bg-[#444] hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg" suppressHydrationWarning>{flag}</span>
                  <span>{t(`languages.${lang}`)}</span>
                </button>
              ))}
            </div>
          </div>

          <Link
            onClick={() => { setIsMobileMenuOpen(false) }}
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')
                ? isDark
                  ? 'bg-[#333] text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDark
                  ? 'text-gray-300 hover:bg-[#333] hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            {t('navigation.home')}
          </Link>

          {/* Mobile Categories */}
          {data.categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => setOpenCategoryId(openCategoryId === category.id ? null : category.id)}
                className={`flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/shop', category.category_name.toLowerCase())
                    ? isDark
                      ? 'bg-[#333] text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDark
                      ? 'text-gray-300 hover:bg-[#333] hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{category.category_name}</span>
                {category.sub_categories?.length > 0 && (
                  <svg
                    className={`ml-1 h-5 w-5 transition-transform duration-200 ${openCategoryId === category.id ? 'rotate-180' : ''
                      }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Mobile Subcategories */}
              <div className={`transition-all duration-300 overflow-hidden ${openCategoryId === category.id ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                }`}>
                <div className="pl-6 space-y-1">
                  {category.sub_categories?.map((subcat) => (
                    <Link
                      key={subcat}
                      href={`/shop?category=${category.category_name.toLowerCase()}&subcategory=${subcat.toLowerCase()}`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setOpenCategoryId(null);
                      }}
                      className={`block py-1.5 text-sm ${
                        isActive('/shop', category.category_name.toLowerCase(), subcat.toLowerCase())
                          ? isDark
                            ? 'text-white font-medium'
                            : 'text-gray-900 font-medium'
                          : isDark
                            ? 'text-gray-300 hover:text-white'
                            : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {subcat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Link
            onClick={() => { setIsMobileMenuOpen(false) }}
            href="/track-order"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/track-order')
                ? isDark
                  ? 'bg-[#333] text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDark
                  ? 'text-gray-300 hover:bg-[#333] hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {t('navigation.trackOrder')}
          </Link>

          <Link
            onClick={() => { setIsMobileMenuOpen(false) }}
            href="/ambassador"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/ambassador')
                ? isDark
                  ? 'bg-[#333] text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDark
                  ? 'text-gray-300 hover:bg-[#333] hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {t('navigation.ambassador')}
          </Link>

          <Link
            onClick={() => { setIsMobileMenuOpen(false) }}
            href="/info?section=contact"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/info?section=contact')
                ? isDark
                  ? 'bg-[#333] text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDark
                  ? 'text-gray-300 hover:bg-[#333] hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {t('navigation.contact')}
          </Link>

          {/* Mobile Login/Profile Button */}
          {user ? (
            <div className="px-3 py-2">
              <div className="flex items-center">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt={user.username || t('navigation.profile')}
                    className="h-8 w-8 rounded-full mr-3"
                  />
                ) : (
                  <div className={`h-8 w-8 rounded-full mr-3 flex items-center justify-center ${
                    isDark ? 'bg-[#444]' : 'bg-gray-100'
                  }`}>
                    <svg className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {user.username || t('navigation.profile')}
                  </p>
                  <div className="mt-1 space-y-1">
                    <Link
                      href="/profile?tab=profile"
                      className={`block text-sm ${
                        isDark 
                          ? 'text-gray-300 hover:text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('profile.tabs.profile')}
                    </Link>
                    <Link
                      href="/profile?tab=orders"
                      className={`block text-sm ${
                        isDark 
                          ? 'text-gray-300 hover:text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('profile.tabs.orders')}
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block text-sm ${
                        isDark 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-red-600 hover:text-red-700'
                      }`}
                    >
                      {t('navigation.signOut')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isDark
                  ? 'text-gray-300 hover:bg-[#333] hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className={`h-5 w-5 mr-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('navigation.signIn')}
            </Link>
          )}
        </nav>

        {/* Mobile Search Box */}
        <div className="px-4 pt-2 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder={t('navigation.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                  isDark
                    ? 'bg-[#333] border-gray-600 text-white placeholder-gray-400 focus:ring-white/60'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-black/60'
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
} 