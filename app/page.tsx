'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "@/app/components/Button";
import Timer from "@/app/components/Timer";
import ProductCard from "@/app/components/ProductCard";
import { useData, Product } from "@/app/context/DataProvider";
import {
  ProductCardSkeleton,
  HeroSkeleton,
  CategorySkeleton,
  OfferSkeleton
} from "@/app/components/skeletons";
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('NEW ARRIVALS');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { isDark } = useTheme();
  const { translations } = useLanguage();

  // Helper function to get translations
  const t = (key: string, params?: Record<string, string | number>) => {
    let value = key.split('.').reduce((o: any, i) => o?.[i], translations);
    if (typeof value === 'string' && params) {
      Object.entries(params).forEach(([key, val]) => {
        value = (value as string).replace(`{${key}}`, String(val));
      });
    }
    return (typeof value === 'string' ? value : key);
  };

  // Get data from context provider
  const { data, isLoading, error } = useData();

  // Filter products based on active filter
  useEffect(() => {
    if (data.products.length > 0) {
      filterProducts(activeFilter, data.products);
    }
  }, [activeFilter, data.products]);

  const filterProducts = (filter: string, products: Product[] = []) => {
    let result: Product[] = [];

    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    switch (filter) {
      case 'NEW ARRIVALS':
        // Sort by newest first
        result = [...products].sort((a, b) => {
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        });
        break;

      case 'SALE':
        // Sort by most ordered (bestsellers)
        result = [...products].sort((a, b) => {
          return (b.total_orders || 0) - (a.total_orders || 0);
        });
        break;

      case 'HOT':
        // Sort by highest review score
        result = [...products].sort((a, b) => {
          return (b.review || 0) - (a.review || 0);
        });
        break;

      case 'DISCOUNTS':
        // Filter by discounted items and sort by discount percentage
        result = [...products]
          .filter(product => (product.discount || 0) > 0)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;

      default:
        result = [...products];
    }

    setFilteredProducts(result.slice(0, 4)); // Limit to 4 items
  };

  // Process banners from API data
  const topBanners = data.images.banners.map(img => ({
    id: img.id,
    title: img.title || 'Fashion Banner',
    image: img.photo_url,
    placement: 'cover'
  })) || [];

  const exclusiveBanner = data.images.offers.length
    ? {
      id: data.images.offers[0].id,
      title: data.images.offers[0].title || 'Exclusive Offer',
      image: data.images.offers[0].photo_url,
      placement: 'exclusive_offer'
    }
    : null;

  // Process categories from API data
  const categories = data.categories.map(cat => ({
    id: cat.id,
    name: cat.category_name,
    slug: cat.category_name.toLowerCase().replace(/\s+/g, '-'),
    subcategories: cat.sub_categories,
    image_url: cat.photo_url || `/images/placeholder.jpg`,
  })) || [];

  useEffect(() => {
    console.log(topBanners)
  }, [data])

  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-grow ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
        {/* Hero Section */}
        <section className={`relative min-h-[700px] ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
          {isLoading ? (
            <HeroSkeleton />
          ) : (
            <div className="relative min-h-[700px]">
              {/* Background Image */}
              {topBanners && topBanners.length > 0 && topBanners[0].image && (
                <div className="absolute inset-0">
                  <Image
                    src={topBanners[0].image}
                    alt={topBanners[0].title || t('hero.title')}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
              )}

              <div className="relative z-10 gap-8 items-center h-full py-[200px] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto top-40">
                <div className="space-y-6">
                  <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    {topBanners && topBanners.length > 0 && topBanners[0].title ? topBanners[0].title : t('hero.title')}
                  </h1>
                  <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('hero.subtitle')}
                  </p>
                  <Button
                    variant="primary"
                    className="mt-4"
                  >
                    {t('hero.cta')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Best Selling Section */}
        <section className={`py-12 px-4 sm:px-6 lg:px-5 mx-auto ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{t('sections.bestSelling.title')}</h2>
            <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('sections.bestSelling.subtitle')}</p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : data.products && data.products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.products.slice(0, 4).map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className={`text-gray-500 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('common.noProducts')}</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/shop" className="flex justify-center">
              <Button variant="secondary">{t('sections.bestSelling.seeAll')}</Button>
            </Link>
          </div>
        </section>

        {/* Products Section (Filtered Products) */}
        <section className={`py-8 px-2 sm:px-3 lg:px-3 mx-auto ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
          <div className="flex justify-center gap-8 mb-12">
            <div className="flex justify-center gap-8 mb-12">
              <button
                className={`transition-all duration-300 ${activeFilter === 'NEW ARRIVALS' 
                  ? `${isDark ? 'text-white font-medium border-b-2 border-white' : 'text-gray-900 font-medium border-b-2 border-gray-900'}` 
                  : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}
                onClick={() => setActiveFilter('NEW ARRIVALS')}
              >
                {t('sections.filters.newArrivals')}
              </button>
              <button
                className={`transition-all duration-300 ${activeFilter === 'SALE' 
                  ? `${isDark ? 'text-white font-medium border-b-2 border-white' : 'text-gray-900 font-medium border-b-2 border-gray-900'}` 
                  : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}
                onClick={() => setActiveFilter('SALE')}
              >
                {t('sections.filters.sale')}
              </button>
              <button
                className={`transition-all duration-300 ${activeFilter === 'HOT' 
                  ? `${isDark ? 'text-white font-medium border-b-2 border-white' : 'text-gray-900 font-medium border-b-2 border-gray-900'}` 
                  : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}
                onClick={() => setActiveFilter('HOT')}
              >
                {t('sections.filters.hot')}
              </button>
              <button
                className={`transition-all duration-300 ${activeFilter === 'DISCOUNTS' 
                  ? `${isDark ? 'text-white font-medium border-b-2 border-white' : 'text-gray-900 font-medium border-b-2 border-gray-900'}` 
                  : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}
                onClick={() => setActiveFilter('DISCOUNTS')}
              >
                {t('sections.filters.discounts')}
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className={`text-gray-500 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('common.noProductsFilter')}</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/shop" className="flex justify-center">
              <Button variant="secondary">{t('sections.bestSelling.seeAll')}</Button>
            </Link>
          </div>
        </section>

        {/* Exclusive Offer Section */}
        <section className={`py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
          {isLoading ? (
            <OfferSkeleton />
          ) : exclusiveBanner ? (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {exclusiveBanner.title || t('sections.exclusive.defaultTitle')}
                </h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('sections.exclusive.subtitle')}
                </p>
                <Button
                  variant="primary"
                  className="mt-4"
                >
                  {t('sections.exclusive.cta')}
                </Button>
              </div>
              <div className="relative h-[400px]">
                <Image
                  src={exclusiveBanner.image}
                  alt={exclusiveBanner.title || t('sections.exclusive.defaultTitle')}
                  fill
                  className="object-cover rounded-3xl"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className={`text-gray-500 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('common.noOffers')}</p>
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className={`py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-black'}`}>
            {t('sections.categories.title')}
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(3)].map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <div key={category.id} className="relative h-[400px] group overflow-hidden rounded-3xl">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                    <h3 className={`text-white text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{category.name}</h3>
                    <p className={`text-white/80 mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {category.subcategories && category.subcategories.length > 0
                        ? t('sections.categories.subcategories', { count: category.subcategories.length })
                        : t('sections.categories.explore')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className={`text-gray-500 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('common.noCategories')}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
