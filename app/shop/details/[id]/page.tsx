'use client'

import { ProductDetailsSkeleton } from "@/app/components/skeletons";
import { useParams } from "next/navigation";
import { useData } from "@/app/context/DataProvider";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/app/components/Button";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const { data, isLoading, error } = useData();
    const { addToCart, cartItems } = useCart();
    const { addToast } = useToast();
    const product = data?.products.find((product) => product.id === id);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isInCart, setIsInCart] = useState(false);

    // Check if product is in cart on initial load and when dependencies change
    useEffect(() => {
        if (product && cartItems) {
            const itemInCart = cartItems.find(
                item => item.id === product.id && 
                item.selectedColor === product.colors?.[selectedColor] &&
                item.selectedSize === selectedSize
            );
            setIsInCart(!!itemInCart);
        }
    }, [cartItems, product, selectedColor, selectedSize]);

    // Animation visibility
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Format colors for display
    const formatColors = (colors: string[] = []): { name: string; value: string; border: boolean }[] => {
        const colorMap: Record<string, string> = {
            white: '#FFFFFF',
            black: '#000000',
            red: '#FF0000',
            green: '#008000',
            blue: '#0000FF',
            yellow: '#FFFF00',
            purple: '#800080',
            pink: '#FFC0CB',
            orange: '#FFA500',
            brown: '#A52A2A',
            gray: '#808080',
            beige: '#F5F5DC'
        };
        
        return colors.map(color => ({
            name: color,
            value: colorMap[color.toLowerCase()] || '#CCCCCC',
            border: color.toLowerCase() === 'white'
        }));
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Validate size if product has sizes
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            addToast('Please select a size', 'error');
            return;
        }

        // Validate color if product has colors
        if (product.colors && product.colors.length > 0 && selectedColor === undefined) {
            addToast('Please select a color', 'error');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            final_price: product.final_price,
            discount: product.discount,
            quantity: quantity,
            image: product.images[0],
            selectedColor: product.colors?.[selectedColor],
            selectedSize: selectedSize
        });

        addToast('Added to cart successfully!', 'success');
    };

    // Error state
    if (error) {
        return (
            <main className="flex h-screen bg-white pt-16 items-center justify-center">
                <div className="bg-white rounded-t-[2.5rem]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center py-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
                            <p className="text-gray-600 mb-8">{error.message}</p>
                            <button 
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-[#000] text-white rounded-md hover:bg-black-90 transition-all duration-300"
                            >
                                Back to Shop
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="h-screen bg-white">
            <div className="bg-white rounded-t-[2.5rem]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {isLoading ? (
                        <ProductDetailsSkeleton />
                    ) : product && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Image Gallery */}
                            <div className={`flex flex-col-reverse lg:flex-row gap-6 transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                                {/* Thumbnail Column/Row */}
                                <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                                    {product.images?.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative min-w-[5rem] w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${selectedImage === index ? 'border-[#000]' : 'border-transparent'}`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`Product view ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Main Image */}
                                <div className="w-full relative aspect-square lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden">
                                    <Image
                                        src={product.images?.[selectedImage] || '/images/placeholder.jpg'}
                                        alt={product.name}
                                        fill
                                        className={`object-cover transition-all duration-500 transform ${isVisible ? 'scale-100' : 'scale-105'}`}
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className={`flex flex-col transition-all duration-700 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                
                                {/* Rating */}
                                <div className={`mt-4 flex items-center gap-2 transition-all duration-500 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`transition-colors duration-300 ${i < Math.floor(product.review || 0) ? 'text-yellow-400' : 'text-gray-200'}`}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {product.review?.toFixed(1)} ({product.review > 0 ? 'reviews' : 'No reviews yet'})
                                    </span>
                                </div>

                                {/* Price */}
                                <div className={`mt-6 transition-all duration-500 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                    {product.discount > 0 ? (
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl font-bold text-[#009450]">${product.final_price?.toFixed(2)}</p>
                                            <p className="text-lg text-gray-500 line-through">${product.price?.toFixed(2)}</p>
                                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                                                {product.discount}% OFF
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">${product.price?.toFixed(2)}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className={`mt-6 transition-all duration-500 delay-600 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                    <h2 className="text-sm font-medium text-gray-900">Description</h2>
                                    <p className="mt-2 text-gray-600">{product.description}</p>
                                </div>

                                {/* Colors */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className={`mt-8 transition-all duration-500 delay-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                        <h2 className="text-sm font-medium text-gray-900">Color</h2>
                                        <div className="mt-3 flex gap-3">
                                            {formatColors(product.colors).map((color, index) => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => setSelectedColor(index)}
                                                    className={`relative w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110 ${color.border ? 'border border-gray-300' : ''}`}
                                                    style={{ backgroundColor: color.value }}
                                                >
                                                    {selectedColor === index && (
                                                        <span className="absolute inset-0 rounded-full ring-2 ring-[#000] transition-opacity duration-200" />
                                                    )}
                                                    <span className="sr-only">{color.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div className={`mt-8 transition-all duration-500 delay-800 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-sm font-medium text-gray-900">Size</h2>
                                            <button className="text-sm font-medium text-[#000] hover:text-black/80 transition-colors duration-200">
                                                Size guide
                                            </button>
                                        </div>
                                        <div className="mt-3 grid grid-cols-6 gap-3">
                                            {product.sizes.map((size) => (
                                                <Button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`flex items-center justify-center rounded-md border py-2 text-sm font-medium transition-all duration-200 transform hover:scale-105
                                                        ${selectedSize === size
                                                            ? 'border-[#FFF] bg-[#000] text-white'
                                                            : 'bg-white !text-black border-black'}`}
                                                >
                                                    {size}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity */}
                                <div className={`mt-8 transition-all duration-500 delay-800 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                    <h2 className="text-sm font-medium text-gray-900 mb-3">Quantity</h2>
                                    <div className="flex items-center w-32 h-10 border border-gray-300 rounded-xl">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-gray-700"
                                            aria-label="Decrease quantity"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="flex-1 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-gray-700"
                                            aria-label="Increase quantity"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 space-y-4">
                                    <button 
                                        onClick={handleAddToCart}
                                        className={`w-full h-14 rounded-md font-medium transition-all duration-300 transform
                                            ${isInCart 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-200' 
                                                : 'bg-[#000] text-white hover:bg-black/90 hover:scale-[1.02] shadow-lg shadow-[#009450]/20'}`}
                                        disabled={isInCart}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {isInCart ? (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Added to Cart</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span>Add to Cart</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                    
                                    {isInCart && (
                                        <Link 
                                            href="/checkout"
                                            className="w-full h-14 rounded-md font-medium bg-black text-[#FFF] hover:bg-black/90 hover:text-white transition-all duration-300 transform flex items-center justify-center gap-2 shadow-lg shadow-[#009450]/10"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>Proceed to Checkout</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
