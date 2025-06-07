'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { Product } from '@/app/context/DataProvider';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isDark } = useTheme();
  const discountedPrice = product.final_price;
  const hasDiscount = product.discount > 0;
  
  return (
    <div className="group relative h-full">
      <div className="aspect-h-4 aspect-w-3 w-full overflow-hidden rounded-lg bg-white dark:bg-black">
        <div className="relative h-[300px] lg:h-[600px] xl:h-[600px] w-full">
          <Link href={`/shop/details/${product.id}`} className="block h-full">
            <Image
              src={product.images[0] || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover object-center"
              priority={true}
            />
            {hasDiscount && (
              <div className="absolute top-2 right-2">
                <div className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                  {product.discount}% OFF
                </div>
              </div>
            )}
          </Link>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className={`text-md font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            <Link href={`/shop/details/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          {hasDiscount ? (
            <div className='flex flex-row gap-x-2'>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-through`}>
                ${product.price.toLocaleString()}
              </p>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                ${discountedPrice.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
              ${product.price}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center mt-1 justify-end">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} ml-1`}>
                {product.review.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}