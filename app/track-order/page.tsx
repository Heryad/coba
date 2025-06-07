'use client';

import { useState, useEffect, Suspense } from 'react';
import { useToast } from '@/app/context/ToastContext';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { useLanguage } from '@/app/context/LanguageContext';
import Image from 'next/image';

interface OrderProduct {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
}

interface Order {
    id: string;
    products: OrderProduct[];
    total: number;
    discount: number;
    status: 'pending' | 'accepted' | 'processing' | 'delivered';
    created_at: string;
    payment_methods: {
        title: string;
        icon: string;
    };
    address: string;
    city: string;
    country: string;
    postcode: string;
}

function TrackOrderContent() {
    const { addToast } = useToast();
    const searchParams = useSearchParams();
    const { isDark } = useTheme();
    const { translations } = useLanguage();
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to get translations
    const t = (key: string) => {
        const value = key.split('.').reduce((o, i) => o?.[i], translations);
        return (typeof value === 'string' ? value : key) as string;
    };

    const fetchOrder = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/orders/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: id }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch order');
            }

            setOrder(data);
        } catch (error) {
            addToast(error instanceof Error ? error.message : 'Failed to track order', 'error');
            setOrder(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Check for orderId in URL on mount
    useEffect(() => {
        const id = searchParams.get('orderId');
        if (id) {
            setOrderId(id);
            fetchOrder(id);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetchOrder(orderId);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'accepted':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        return t(`trackOrder.details.status.${status}`);
    };

    return (
        <main className={`${isDark ? 'bg-[#222]' : 'bg-white'} min-h-screen`}>
            <div className={`${isDark ? 'bg-[#222]' : 'bg-white'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12 transform transition-all duration-500 hover:scale-[1.02]">
                        <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {t('trackOrder.title')}
                        </h1>
                        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {t('trackOrder.subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
                        <div className="flex gap-4 group">
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder={t('trackOrder.form.placeholder')}
                                className={`flex-1 rounded-xl border-2 px-4 py-3 transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-[#333] border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20 group-hover:border-gray-500'
                                        : 'bg-white border-gray-200 text-gray-900 focus:border-black focus:ring-black/20 group-hover:border-black/50'
                                }`}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-6 py-3 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
                                    isDark 
                                        ? 'bg-white text-black hover:bg-gray-200 shadow-white/20 hover:shadow-white/30'
                                        : 'bg-black text-white hover:bg-black/80 shadow-black/20 hover:shadow-black/30'
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('trackOrder.form.tracking')}
                                    </span>
                                ) : t('trackOrder.form.button')}
                            </button>
                        </div>
                    </form>

                    {order && (
                        <div className={`rounded-2xl shadow-xl p-6 space-y-6 transform transition-all duration-500 animate-fadeIn ${
                            isDark ? 'bg-[#2A2A2A]' : 'bg-white'
                        }`}>
                            {/* Order Status */}
                            <div className={`flex items-center justify-between p-4 rounded-xl border ${
                                isDark 
                                    ? 'bg-gradient-to-r from-[#333] to-[#2A2A2A] border-gray-600'
                                    : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'
                            }`}>
                                <div>
                                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t('trackOrder.details.orderNumber')}{order.id}
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {t('trackOrder.details.placedOn')} {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)} transition-all duration-300 hover:scale-105`}>
                                    {getStatusText(order.status)}
                                </span>
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={`rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-gradient-to-br from-[#333] to-[#2A2A2A] border-gray-600'
                                        : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
                                }`}>
                                    <h3 className={`text-lg font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        <svg className={`w-5 h-5 ${isDark ? 'text-white' : 'text-[#000]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {t('trackOrder.details.shipping.title')}
                                    </h3>
                                    <div className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <p>{order.address}</p>
                                        <p>{order.city}, {order.postcode}</p>
                                        <p>{order.country}</p>
                                    </div>
                                </div>

                                <div className={`rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-gradient-to-br from-[#333] to-[#2A2A2A] border-gray-600'
                                        : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
                                }`}>
                                    <h3 className={`text-lg font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        <svg className={`w-5 h-5 ${isDark ? 'text-white' : 'text-[#000]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        {t('trackOrder.details.payment.title')}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {order.payment_methods.icon && (
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm">
                                                <Image
                                                    src={order.payment_methods.icon}
                                                    alt={order.payment_methods.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{order.payment_methods.title}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className={`rounded-xl p-6 border shadow-sm ${
                                isDark 
                                    ? 'bg-gradient-to-br from-[#333] to-[#2A2A2A] border-gray-600'
                                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
                            }`}>
                                <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <svg className={`w-5 h-5 ${isDark ? 'text-white' : 'text-[#000]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {t('trackOrder.details.items.title')}
                                </h3>
                                <div className="space-y-4">
                                    {order.products.map((product, index) => (
                                        <div 
                                            key={product.id + product.selectedColor + product.selectedSize} 
                                            className={`flex gap-4 p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                                                isDark 
                                                    ? 'bg-[#333] border-gray-600'
                                                    : 'bg-white border-gray-100'
                                            }`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {product.name}
                                                </h4>
                                                <div className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {product.selectedColor && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: product.selectedColor }} />
                                                        </span>
                                                    )}
                                                    {product.selectedSize && (
                                                        <span className="ml-2">{t('trackOrder.details.items.size')}: {product.selectedSize}</span>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {t('trackOrder.details.items.quantity')}: {product.quantity}
                                                    </span>
                                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        ${(product.price * product.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className={`rounded-xl p-6 border shadow-sm ${
                                isDark 
                                    ? 'bg-gradient-to-br from-[#333] to-[#2A2A2A] border-gray-600'
                                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
                            }`}>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                            {t('trackOrder.details.summary.subtotal')}
                                        </span>
                                        <span className={isDark ? 'text-white' : 'text-black'}>${order.total.toFixed(2)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                                {t('trackOrder.details.summary.discount')}
                                            </span>
                                            <span className={isDark ? 'text-white' : 'text-black'}>-${order.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className={`border-t pt-3 mt-3 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                                        <div className="flex justify-between">
                                            <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                                {t('trackOrder.details.summary.total')}
                                            </span>
                                            <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                                ${(order.total - order.discount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function TrackOrderPage() {
    const { isDark } = useTheme();
    
    return (
        <Suspense fallback={
            <main className={`min-h-screen ${isDark ? 'bg-[#222]' : 'bg-gradient-to-b from-[#E8F5E9] to-white'}`}>
                <div className={`min-h-[calc(100vh-4rem)] shadow-lg ${
                    isDark 
                        ? 'bg-[#222] rounded-t-[2.5rem]'
                        : 'bg-white rounded-t-[2.5rem]'
                }`}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center">
                            <div className="animate-pulse">
                                <div className={`h-8 rounded w-1/3 mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 rounded w-1/2 mx-auto ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        }>
            <TrackOrderContent />
        </Suspense>
    );
} 