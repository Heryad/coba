'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/app/context/DataProvider';
import ProductCard from '@/app/components/ProductCard';
import ProductCardSkeleton from '@/app/components/skeletons/ProductCardSkeleton';

export default function ShopPage() {
  const { data, isLoading, error } = useData();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Sort options for the dropdown
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
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
  }, []);

  const FilterPanel = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        </div>
        <button 
          onClick={() => setIsMobileFilterOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Categories Dropdown */}
      <div className={`mb-8 transition-all duration-500 delay-100 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Categories</h3>
        <select
          className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#009450]/20 focus:border-[#009450]"
        >
          <option value="">All Categories</option>
          {data.categories.map(category => (
            <option key={category.id} value={category.id}>{category.category_name}</option>
          ))}
        </select>
      </div>

      {/* Subcategories Dropdown */}
      <div className={`mb-8 transition-all duration-500 delay-150 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Subcategories</h3>
        <select
          className="w-full bg-white border border-gray-300 text-black rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#009450]/20 focus:border-[#009450]"
        >
          <option value="">All Subcategories</option>
          {data.categories.flatMap(category => 
            (category.sub_categories || []).map(subcategory => (
              <option key={subcategory} value={subcategory} className='text-black'>
                {subcategory}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Price Range Inputs */}
      <div className={`mb-8 transition-all duration-500 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="shop-min-price" className="text-xs text-gray-500 block mb-1">Min ($)</label>
            <input
              id="shop-min-price"
              type="text"
              placeholder="0"
              className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#009450]/20 focus:border-[#009450]"
            />
          </div>
          <div>
            <label htmlFor="shop-max-price" className="text-xs text-gray-500 block mb-1">Max ($)</label>
            <input
              id="shop-max-price"
              type="text"
              placeholder="1000"
              className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#009450]/20 focus:border-[#009450]"
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className={`mb-8 transition-all duration-500 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {commonColors.map((color) => (
            <button
              key={color.value}
              className="group relative w-10 h-10 rounded-full transition-transform duration-200 hover:scale-110 ring-1 ring-gray-200"
              aria-label={color.label}
              title={color.label}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className={`mb-8 transition-all duration-500 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {commonSizes.map((size) => (
            <button
              key={size}
              className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Apply Filters Button (Mobile Only) */}
      <button
        onClick={() => setIsMobileFilterOpen(false)}
        className="lg:hidden w-full mt-6 bg-[#009450] text-white py-3 rounded-xl hover:bg-[#007540] transition-all duration-300 transform hover:scale-[1.02] font-medium"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <main className="bg-[#E8F5E9] min-h-screen pt-16">
      <div className="bg-white rounded-t-[2.5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </button>

          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <div className={`hidden lg:block w-80 flex-shrink-0 transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </div>

            {/* Mobile Filter Panel */}
            <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white transform transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full overflow-y-auto">
                  <FilterPanel />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 transition-all duration-500 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {isLoading ? 'Loading products...' : 
                      error ? '' :
                      `${data.products.length} products`}
                  </p>
                </div>
                <select 
                  className="w-full sm:w-auto text-black px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009450]/20 focus:border-[#009450] bg-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      Sort by: {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <ProductCardSkeleton key={Math.random()}/>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading products</h3>
                  <p className="mt-1 text-sm text-gray-500">{''}</p>
                </div>
              ) : data.products.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                  <p className="mt-1 text-sm text-gray-500">Check back later for products.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {data.products.map(product => (
                    <div key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>    
    </main>
  );
}
