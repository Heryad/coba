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

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('NEW ARRIVALS');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
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
    placement: 'top'
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-white">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {isLoading ? (
            <HeroSkeleton />
          ) : (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {topBanners && topBanners.length > 0 && topBanners[0].title ? topBanners[0].title : 'Discover and Find Your Own Fashion!'}
                </h1>
                <p className="text-lg text-gray-600">
                  Explore our curated collection of stylish clothing and accessories tailored to your unique taste.
                </p>
                <Link href="/shop">
                  <Button size="lg" variant="primary">
                    EXPLORE NOW
                  </Button>
                </Link>
              </div>
              <div className="relative h-[500px] rounded-tr-[8rem] rounded-bl-[8rem] overflow-hidden bg-red-500">
                {topBanners && topBanners.length > 0 && (
                  <Image
                    src={topBanners[0].image}
                    alt={topBanners[0].title || "Fashion model"}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute bottom-0 right-0 p-8">
                  <div className="flex gap-1">
                    {[...Array(1)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-white rounded-full opacity-60" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Best Selling Section */}
        <div className="rounded-t-[2.5rem] mt-12">
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Best selling</h2>
              <p className="mt-4 text-gray-600">Get in on the trend with our curated selection of best-selling styles</p>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(3)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : data.products && data.products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.products.slice(0, 3).map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No products available.</p>
              </div>
            )}
            <div className="text-center mt-8">
              <Link href="/shop">
                <Button variant="outline">See all</Button>
              </Link>
            </div>
          </section>
        </div>

        {/* Products Section (Filtered Products) */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-center gap-8 mb-12">
            <button 
              className={`transition-all duration-300 ${activeFilter === 'NEW ARRIVALS' ? 'text-gray-900 font-medium border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveFilter('NEW ARRIVALS')}
            >
              NEW ARRIVALS
            </button>
            <button 
              className={`transition-all duration-300 ${activeFilter === 'SALE' ? 'text-gray-900 font-medium border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveFilter('SALE')}
            >
              SALE
            </button>
            <button 
              className={`transition-all duration-300 ${activeFilter === 'HOT' ? 'text-gray-900 font-medium border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveFilter('HOT')}
            >
              HOT
            </button>
            <button 
              className={`transition-all duration-300 ${activeFilter === 'DISCOUNTS' ? 'text-gray-900 font-medium border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveFilter('DISCOUNTS')}
            >
              DISCOUNTS
            </button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No products available for this filter.</p>
            </div>
          )}
        </section>

        {/* Exclusive Offer Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {isLoading ? (
            <OfferSkeleton />
          ) : exclusiveBanner ? (
            <div className="bg-[#000]/10 rounded-3xl p-8 lg:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {exclusiveBanner.title}
                  </h2>
                  <p className="text-gray-600">
                    Unlock the exclusive style right now! Get 10% off on new arrivals.
                  </p>
                  <div className="bg-[#009450]/5 p-6 rounded-xl inline-block">
                    <Timer />
                  </div>
                  <Link href="/shop">
                    <Button size="lg" variant="primary" className="ml-6">
                      SHOP NOW
                    </Button>
                  </Link>
                </div>
                <div className="relative h-[400px]">
                  <Image
                    src={exclusiveBanner.image}
                    alt="Exclusive offer"
                    fill
                    className="object-cover rounded-3xl"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No exclusive offers available at this time.</p>
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Designer Clothes For You
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
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                    <p className="text-white/80 mt-2">
                      {category.subcategories && category.subcategories.length > 0 
                        ? `${category.subcategories.length} subcategories available` 
                        : 'Explore our collection'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No categories available.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
