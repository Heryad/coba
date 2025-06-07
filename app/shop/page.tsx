'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useData } from '@/app/context/DataProvider';
import ProductCard from '@/app/components/ProductCard';
import ProductCardSkeleton from '@/app/components/skeletons/ProductCardSkeleton';
import { Product } from '@/app/context/DataProvider';
import { useSearchParams } from "next/navigation";
import { FunnelIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

function ShopContent() {
  const { data, isLoading, error } = useData();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const { translations } = useLanguage();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Helper function to get translations
  const t = (key: string, params?: Record<string, any>) => {
    let value = key.split('.').reduce((o: any, i) => o?.[i], translations);
    if (typeof value === 'string' && params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = (value as string).replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
    }
    return (typeof value === 'string' ? value : key);
  };
  
  // Sort options for the dropdown
  const sortOptions = [
    { value: 'newest', label: t('shop.sort.options.newest') },
    { value: 'price-low-high', label: t('shop.sort.options.priceLowHigh') },
    { value: 'price-high-low', label: t('shop.sort.options.priceHighLow') },
    { value: 'rating', label: t('shop.sort.options.rating') },
  ];

  // Common colors for filter
  const commonColors = [
    { value: 'white', label: 'White', hex: '#FFFFFF' },
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'gray', label: 'Gray', hex: '#808080' },
    { value: 'red', label: 'Red', hex: '#FF0000' },
    { value: 'blue', label: 'Blue', hex: '#0000FF' },
    { value: 'green', label: 'Green', hex: '#008000' },
    { value: 'yellow', label: 'Yellow', hex: '#FFFF00' },
    { value: 'purple', label: 'Purple', hex: '#800080' },
  ];

  // Common sizes for filter
  const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Animation effect on load
  useEffect(() => {
    setIsVisible(true);
    // Initialize filtered products with all products
    if (data.products && !isLoading && !error) {
      setFilteredProducts(data.products);
    }
  }, [data.products, isLoading, error]);

  // Check URL parameters and apply initial filters
  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');

    if (category || subcategory || search) {
      setSelectedCategory(category || '');
      setSelectedSubcategory(subcategory || '');
      applyFilters(category || '', subcategory || '', search || '');
    }
  }, [searchParams, data.products]);

  // Function to apply filters
  const applyFilters = (
    category: string = selectedCategory, 
    subcategory: string = selectedSubcategory,
    search: string = searchParams.get('search') || ''
  ) => {
    if (isLoading || error || !data.products) {
      return;
    }

    let filtered = [...data.products];

    // Filter by search query
    if (search) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter(product => product.category.toLowerCase() === category.toLocaleLowerCase());
    }

    // Filter by subcategory
    if (subcategory) {
      filtered = filtered.filter(product => product.subcategory.toLowerCase() === subcategory.toLowerCase());
    }

    // Filter by price range
    if (minPrice !== '') {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors && product.colors.some(color => selectedColors.includes(color))
      );
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Sort products
    switch (sortOption) {
      case 'price-low-high':
        filtered.sort((a, b) => a.final_price - b.final_price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.final_price - a.final_price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.review || 0) - (a.review || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return 0;
        });
        break;
    }

    setFilteredProducts(filtered);
    setIsMobileFilterOpen(false);
  };

  const applyFilter = () => {
    applyFilters();
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortOption('newest');
    // Reset to all products and remove search from URL
    if (searchParams.get('search')) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('search');
      window.history.pushState({}, '', newUrl.toString());
    }
    setFilteredProducts(data.products || []);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      selectedCategory !== '' ||
      selectedSubcategory !== '' ||
      minPrice !== '' ||
      maxPrice !== '' ||
      selectedColors.length > 0 ||
      selectedSizes.length > 0 ||
      searchParams.get('search') !== null
    );
  };

  const toggleColorSelection = (colorValue: string) => {
    setSelectedColors(prev => 
      prev.includes(colorValue) 
        ? prev.filter(c => c !== colorValue) 
        : [...prev, colorValue]
    );
  };

  const toggleSizeSelection = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };

  // Handle sort change separately from filters
  const handleSortChange = (value: string) => {
    setSortOption(value);
    // Apply sort immediately
    let sorted = [...filteredProducts];
    
    switch (value) {
      case 'price-low-high':
        sorted.sort((a, b) => a.final_price - b.final_price);
        break;
      case 'price-high-low':
        sorted.sort((a, b) => b.final_price - a.final_price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.review || 0) - (a.review || 0));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return 0;
        });
        break;
    }
    
    setFilteredProducts(sorted);
  };

  const FilterPanel = ({ isMobile }: { isMobile: boolean }) => (
    <div className="p-6 xl:p-0 lg:p-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('shop.filters.title')}</h2>
        </div>
        <button 
          onClick={() => setIsMobileFilterOpen(false)}
          className={`lg:hidden ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Categories Dropdown */}
      <div className={`mb-8 transition-all duration-500 delay-100 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-4`}>{t('shop.filters.categories')}</h3>
        <select
          id={isMobile ? "mobile-categories" : "desktop-categories"}
          className={`w-full rounded-lg py-2.5 px-3 transition-colors duration-200 ${
            isDark 
              ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
              : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20'
          }`}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">{t('shop.filters.allCategories')}</option>
          {data?.categories?.map(category => (
            <option key={category.id} value={category.category_name}>{category.category_name}</option>
          ))}
        </select>
      </div>

      {/* Subcategories Dropdown */}
      <div className={`mb-8 transition-all duration-500 delay-150 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-4`}>{t('shop.filters.subcategories')}</h3>
        <select
          id={isMobile ? "mobile-subcategories" : "desktop-subcategories"}
          className={`w-full rounded-lg py-2.5 px-3 transition-colors duration-200 ${
            isDark 
              ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
              : 'bg-white border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20'
          }`}
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
        >
          <option value="">{t('shop.filters.allSubcategories')}</option>
          {selectedCategory && data?.categories
            ?.find(category => category.category_name === selectedCategory)
            ?.sub_categories?.map(subcategory => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
        </select>
      </div>

      {/* Price Range Inputs */}
      <div className={`mb-8 transition-all duration-500 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-4`}>{t('shop.filters.priceRange.title')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} block mb-1`}>{t('shop.filters.priceRange.min')}</label>
            <input
              type="text"
              placeholder="0"
              value={minPrice}
              onChange={(e) => {setMinPrice(e.target.value)}}
              className={`w-full rounded-lg py-2 px-3 transition-colors duration-200 ${
                isDark 
                  ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20'
              }`}
            />
          </div>
          <div>
            <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} block mb-1`}>{t('shop.filters.priceRange.max')}</label>
            <input
              type="text"
              placeholder="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={`w-full rounded-lg py-2 px-3 transition-colors duration-200 ${
                isDark 
                  ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className={`mb-8 transition-all duration-500 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-4`}>{t('shop.filters.colors')}</h3>
        <div className="flex flex-wrap gap-3">
          {commonColors.map((color) => (
            <button
              key={color.value}
              className={`group relative w-10 h-10 rounded-full transition-transform duration-200 hover:scale-110 ring-1 ${
                selectedColors.includes(color.value) 
                  ? isDark ? 'ring-2 ring-white' : 'ring-2 ring-black' 
                  : isDark ? 'ring-gray-600' : 'ring-gray-200'
              }`}
              aria-label={color.label}
              title={color.label}
              onClick={() => toggleColorSelection(color.value)}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: color.hex }}
              />
              {selectedColors.includes(color.value) && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className={`mb-8 transition-all duration-500 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-4`}>{t('shop.filters.sizes')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {commonSizes.map((size) => (
            <button
              key={size}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
                selectedSizes.includes(size) 
                  ? isDark 
                    ? 'bg-white text-black' 
                    : 'bg-[#000] text-white' 
                  : isDark
                    ? 'bg-[#333] text-gray-200 hover:bg-[#444]'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
              onClick={() => toggleSizeSelection(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={applyFilter}
          className={`w-full py-3 rounded-md transition-all duration-300 transform hover:scale-[1.02] font-medium ${
            isDark 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'bg-[#000] text-white hover:bg-black/90'
          }`}
        >
          {t('shop.filters.buttons.apply')}
        </button>
        {hasActiveFilters() && (
          <button
            onClick={resetFilters}
            className={`w-full py-3 rounded-md transition-all duration-300 transform hover:scale-[1.02] font-medium ${
              isDark 
                ? 'bg-[#333] text-gray-200 hover:bg-[#444]' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('shop.filters.buttons.reset')}
          </button>
        )}
      </div>
    </div>
  );

  if (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
      ? error.message 
      : 'An error occurred';
    
    return (
      <div className="text-center py-16">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>{t('shop.status.noProducts')}</h2>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>{errorMessage}</p>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className={`lg:hidden mb-4 flex items-center gap-2 transition-colors duration-200 ${
              isDark 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FunnelIcon className='w-6 h-6'/>
            {t('shop.filters.title')}
          </button>

          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <div className={`hidden lg:hidden w-80 flex-shrink-0 transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="sticky top-24">
                <FilterPanel isMobile={false} />
              </div>
            </div>

            {/* Mobile Filter Panel */}
            <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className={`absolute right-0 top-0 h-full w-full max-w-sm ${isDark ? 'bg-[#222]' : 'bg-white'} transform transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full overflow-y-auto">
                  <FilterPanel isMobile={true} />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 transition-all duration-500 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {searchParams.get('search') ? (
                      t('shop.title.searchResults', { query: searchParams.get('search') })
                    ) : selectedCategory ? (
                      selectedSubcategory ? (
                        t('shop.title.categoryAndSubcategory', { category: selectedCategory, subcategory: selectedSubcategory })
                      ) : (
                        t('shop.title.categoryOnly', { category: selectedCategory })
                      )
                    ) : (
                      t('shop.title.allProducts')
                    )}
                  </h1>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isLoading ? t('shop.status.loading') : 
                      error ? '' :
                      t('shop.status.productsCount', { count: filteredProducts.length })}
                  </p>
                </div>
                <select 
                  id="product-sort"
                  className={`w-full sm:w-auto px-4 py-2 rounded-md transition-colors duration-200 ${
                    isDark 
                      ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                      : 'bg-white border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20'
                  }`}
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {t('shop.sort.title', { option: option.label })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <ProductCardSkeleton key={index}/>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <svg className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className={`mt-2 text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('shop.status.noProducts')}</h3>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {typeof error === 'object' && error !== null && 'message' in error ? error : 'An error occurred'}
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <svg className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className={`mt-2 text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('shop.status.noProducts')}</h3>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('shop.status.tryAdjusting')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div> 
    </main>
  );
}

export default function ShopPage() {
  const { isDark } = useTheme();
  
  return (
    <Suspense fallback={
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-white' : 'border-gray-900'}`}></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}