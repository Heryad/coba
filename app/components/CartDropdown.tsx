'use client'

import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartDropdown({ onAction }: { onAction: () => void }) {
    const router = useRouter();
    const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
    const { isDark } = useTheme();
    const { translations } = useLanguage();

    // Helper function to get translations
    const t = (key: string) => {
        const value = key.split('.').reduce((o: any, i) => o?.[i], translations);
        return typeof value === 'string' ? value : key;
    };

    const handleCheckout = () => {
        onAction();
        router.push('/checkout');
    };

    return (
        <div className={`absolute md:right-0 md:-left-70 mt-3 md:w-92 -left-60 w-82 sm:w-72 ${isDark ? 'bg-[#222]' : 'bg-white'} shadow-xl overflow-hidden rounded-lg`}>
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('cart.title')}</h3>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {cartItems.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('cart.empty')}</p>
                    </div>
                ) : (
                    <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {cartItems.map((item) => (
                            <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="p-4">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                                                {item.name}
                                            </h4>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                                                className={`${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                                                aria-label={t('cart.remove')}
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Color and Size */}
                                        <div className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {item.selectedColor && (
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.selectedColor }} />
                                                </span>
                                            )}
                                            {item.selectedSize && (
                                                <span className="ml-2">{t('cart.size')}: {item.selectedSize}</span>
                                            )}
                                        </div>

                                        {/* Price and Quantity */}
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className={`w-6 h-6 rounded-full border ${isDark ? 'border-gray-600 text-gray-400 hover:bg-gray-800' : 'border-gray-300 text-gray-500 hover:bg-gray-50'} flex items-center justify-center`}
                                                    aria-label={t('cart.decrease')}
                                                >
                                                    -
                                                </button>
                                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className={`w-6 h-6 rounded-full border ${isDark ? 'border-gray-600 text-gray-400 hover:bg-gray-800' : 'border-gray-300 text-gray-500 hover:bg-gray-50'} flex items-center justify-center`}
                                                    aria-label={t('cart.increase')}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                ${((item.final_price || item.price) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
                <div className={`p-4 ${isDark ? 'bg-[#222] border-t border-gray-700' : 'bg-gray-50 border-t border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('cart.total')}</span>
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${totalPrice.toFixed(2)}</span>
                    </div>
                    <Button
                        onClick={handleCheckout}
                        variant='primary'
                        className="w-full h-12 rounded-md font-medium flex items-center justify-center"
                    >
                        {t('cart.checkout')}
                        <ShoppingCartIcon className='w-5 h-5 ml-4'/>
                    </Button>
                </div>
            )}
        </div>
    );
} 