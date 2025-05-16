'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useData } from '@/app/context/DataProvider';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data } = useData();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shopBtnRef = useRef<HTMLButtonElement>(null);

  // Check if current path matches
  const isActive = (path: string) => {
    return pathname === path;
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

  return (
    <header 
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        hasScrolled 
          ? 'bg-[#009450] shadow-md' 
          : 'bg-[#E8F5E9]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className={`text-2xl font-bold ${hasScrolled ? 'text-white' : 'text-gray-900'}`}>
              Coba
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-8">
            <Link 
              href="/" 
              className={`inline-flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                isActive('/') 
                  ? `${hasScrolled ? 'border-white text-white' : 'border-[#009450] text-gray-900'}` 
                  : `border-transparent ${hasScrolled ? 'text-white/80 hover:text-white hover:border-white/60' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`
              }`}
            >
              Home
            </Link>

            {/* Shop Dropdown - Using hover on desktop */}
            <div className="relative">
              <button
                ref={shopBtnRef}
                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)} // Keep for mobile/accessibility
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                className={`inline-flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                  isActive('/shop') 
                    ? `${hasScrolled ? 'border-white text-white' : 'border-[#009450] text-gray-900'}` 
                    : `border-transparent ${hasScrolled ? 'text-white/80 hover:text-white hover:border-white/60' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`
                }`}
              >
                Shop
                <svg
                  className={`ml-1 h-5 w-5 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`}
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

              {/* Dropdown Menu Container */}
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
                {/* Main dropdown with categories and subcategories side by side */}
                <div className="flex shadow-xl rounded-lg overflow-hidden">
                  {/* Categories column */}
                  <div className="w-64 bg-white">
                    <div className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                      Categories
                    </div>
                    <div className="py-2">
                      {data.categories.map((category) => (
                        <div 
                          key={category.id}
                          className={`px-4 py-2.5 text-sm hover:bg-gray-100 cursor-pointer ${
                            openCategoryId === category.id ? 'bg-gray-100' : ''
                          }`}
                          onMouseEnter={() => setOpenCategoryId(category.id)}
                        >
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/shop/${category.category_name.toLowerCase()}`}
                              className="font-medium text-gray-700 hover:text-[#009450]"
                            >
                              {category.category_name}
                            </Link>
                            {category.sub_categories?.length > 0 && (
                              <svg
                                className="h-4 w-4 text-gray-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Subcategories column - always visible, shows different subcategories based on hover */}
                  <div className="w-72 bg-gray-50 py-2">
                    {openCategoryId ? (
                      <>
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                          {data.categories.find(c => c.id === openCategoryId)?.category_name || 'Subcategories'}
                        </div>
                        <div className="py-3 px-2">
                          {data.categories.find(c => c.id === openCategoryId)?.sub_categories?.map((subcat) => (
                            <div key={subcat + 1} onClick={() => {setIsShopDropdownOpen(false);}}>
                              <Link
                              key={subcat}
                              href={`/shop?category=${data.categories.find(c => c.id === openCategoryId)?.category_name.toLowerCase()}&subcategory=${subcat.toLowerCase()}`}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-white hover:text-[#009450] rounded-md"
                            >
                              {subcat}
                            </Link>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-gray-500">
                        
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Link 
              href="/track-order" 
              className={`inline-flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                isActive('/track-order') 
                  ? `${hasScrolled ? 'border-white text-white' : 'border-[#009450] text-gray-900'}` 
                  : `border-transparent ${hasScrolled ? 'text-white/80 hover:text-white hover:border-white/60' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`
              }`}
            >
              Track Order
            </Link>

            <Link 
              href="/contact" 
              className={`inline-flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                isActive('/contact') 
                  ? `${hasScrolled ? 'border-white text-white' : 'border-[#009450] text-gray-900'}` 
                  : `border-transparent ${hasScrolled ? 'text-white/80 hover:text-white hover:border-white/60' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Search, Login and Cart */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                  hasScrolled 
                    ? 'border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-white' 
                    : 'border-gray-300 focus:ring-[#009450]'
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className={`h-5 w-5 ${hasScrolled ? 'text-white/60' : 'text-[#009450]'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Login */}
            <Link href="/login" className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
              hasScrolled ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-[#009450]'
            }`}>
              <svg className={`h-5 w-5 mr-1 ${hasScrolled ? 'text-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Login
            </Link>

            {/* Cart */}
            <Link href="/cart" className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
              hasScrolled ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-[#009450]'
            }`}>
              <svg className={`h-5 w-5 mr-1 ${hasScrolled ? 'text-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-[#009450] text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-4">
            {/* Mobile Search */}
            <button 
              onClick={() => {/* Toggle search modal */}}
              className={`p-2 rounded-full ${hasScrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              <svg 
                className={`h-5 w-5 ${hasScrolled ? 'text-white' : 'text-gray-500'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Mobile Cart */}
            <Link 
              href="/cart" 
              className={`relative p-2 rounded-full ${hasScrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              <svg 
                className={`h-5 w-5 ${hasScrolled ? 'text-white' : 'text-gray-500'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-[#009450] text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${hasScrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              <svg 
                className={`h-6 w-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''} ${
                  hasScrolled ? 'text-white' : 'text-gray-500'
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
      <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white ${
        isMobileMenuOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0'
      }`}>
        <nav className="px-4 pt-2 pb-3 space-y-1 border-t border-gray-200">
          <Link 
            href="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') 
                ? 'bg-[#009450]/10 text-[#009450]' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>
          
          {/* Mobile Shop Categories */}
          <div>
            <button
              onClick={() => setMobileShopOpen(!mobileShopOpen)}
              className={`flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                isActive('/shop') 
                  ? 'bg-[#009450]/10 text-[#009450]' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>Shop</span>
              <svg
                className={`ml-1 h-5 w-5 transition-transform duration-200 ${mobileShopOpen ? 'rotate-180' : ''}`}
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
            
            {/* Mobile Categories Dropdown */}
            <div className={`transition-all duration-300 overflow-hidden ${
              mobileShopOpen ? 'max-h-[70vh] opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}>
              {data.categories.map((category) => (
                <div key={category.id} className="ml-4">
                  <button
                    className="flex justify-between items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-[#009450]"
                    onClick={() => setOpenCategoryId(openCategoryId === category.id ? null : category.id)}
                  >
                    <span>{category.category_name}</span>
                    {category.sub_categories?.length > 0 && (
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openCategoryId === category.id ? 'rotate-180' : ''
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
                  <div className={`transition-all duration-300 overflow-hidden ${
                    openCategoryId === category.id ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pl-6 space-y-1">
                      {category.sub_categories?.map((subcat) => (
                        <Link
                          key={subcat}
                          href={`/shop/${category.category_name.toLowerCase()}/${subcat.toLowerCase()}`}
                          className="block py-1.5 text-sm text-gray-500 hover:text-[#009450]"
                        >
                          {subcat}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Link 
            href="/track-order" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/track-order') 
                ? 'bg-[#009450]/10 text-[#009450]' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Track Order
          </Link>
          
          <Link 
            href="/contact" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/contact') 
                ? 'bg-[#009450]/10 text-[#009450]' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Contact
          </Link>
          
          {/* Mobile Login Button */}
          <Link
            href="/login"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Login / Register
          </Link>
        </nav>
        
        {/* Mobile Search Box */}
        <div className="px-4 pt-2 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009450] focus:border-transparent text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 