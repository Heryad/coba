'use client';

import { useCart } from '@/app/context/CartContext';
import { useToast } from '@/app/context/ToastContext';
import { useData } from '@/app/context/DataProvider';
import { useTheme } from '@/app/context/ThemeContext';
import { useLanguage } from '@/app/context/LanguageContext';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface Country {
    name: string;
    flag: string;
}

interface FormData {
    username: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
}

const countries: Country[] = [
    { name: "Afghanistan", flag: "🇦🇫" },
    { name: "Albania", flag: "🇦🇱" },
    { name: "Algeria", flag: "🇩🇿" },
    { name: "Andorra", flag: "🇦🇩" },
    { name: "Angola", flag: "🇦🇴" },
    { name: "Antigua and Barbuda", flag: "🇦🇬" },
    { name: "Argentina", flag: "🇦🇷" },
    { name: "Armenia", flag: "🇦🇲" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Austria", flag: "🇦🇹" },
    { name: "Azerbaijan", flag: "🇦🇿" },
    { name: "Bahamas", flag: "🇧🇸" },
    { name: "Bahrain", flag: "🇧🇭" },
    { name: "Bangladesh", flag: "🇧🇩" },
    { name: "Barbados", flag: "🇧🇧" },
    { name: "Belarus", flag: "🇧🇾" },
    { name: "Belgium", flag: "🇧🇪" },
    { name: "Belize", flag: "🇧🇿" },
    { name: "Benin", flag: "🇧🇯" },
    { name: "Bhutan", flag: "🇧🇹" },
    { name: "Bolivia", flag: "🇧🇴" },
    { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
    { name: "Botswana", flag: "🇧🇼" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Brunei", flag: "🇧🇳" },
    { name: "Bulgaria", flag: "🇧🇬" },
    { name: "Burkina Faso", flag: "🇧🇫" },
    { name: "Burundi", flag: "🇧🇮" },
    { name: "Cabo Verde", flag: "🇨🇻" },
    { name: "Cambodia", flag: "🇰🇭" },
    { name: "Cameroon", flag: "🇨🇲" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Central African Republic", flag: "🇨🇫" },
    { name: "Chad", flag: "🇹🇩" },
    { name: "Chile", flag: "🇨🇱" },
    { name: "China", flag: "🇨🇳" },
    { name: "Colombia", flag: "🇨🇴" },
    { name: "Comoros", flag: "🇰🇲" },
    { name: "Congo (Congo-Brazzaville)", flag: "🇨🇬" },
    { name: "Congo (Congo-Kinshasa)", flag: "🇨🇩" },
    { name: "Costa Rica", flag: "🇨🇷" },
    { name: "Croatia", flag: "🇭🇷" },
    { name: "Cuba", flag: "🇨🇺" },
    { name: "Cyprus", flag: "🇨🇾" },
    { name: "Czech Republic", flag: "🇨🇿" },
    { name: "Denmark", flag: "🇩🇰" },
    { name: "Djibouti", flag: "🇩🇯" },
    { name: "Dominica", flag: "🇩🇲" },
    { name: "Dominican Republic", flag: "🇩🇴" },
    { name: "Ecuador", flag: "🇪🇨" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "El Salvador", flag: "🇸🇻" },
    { name: "Equatorial Guinea", flag: "🇬🇶" },
    { name: "Eritrea", flag: "🇪🇷" },
    { name: "Estonia", flag: "🇪🇪" },
    { name: "Eswatini", flag: "🇸🇿" },
    { name: "Ethiopia", flag: "🇪🇹" },
    { name: "Fiji", flag: "🇫🇯" },
    { name: "Finland", flag: "🇫🇮" },
    { name: "France", flag: "🇫🇷" },
    { name: "Gabon", flag: "🇬🇦" },
    { name: "Gambia", flag: "🇬🇲" },
    { name: "Georgia", flag: "🇬🇪" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Greece", flag: "🇬🇷" },
    { name: "Grenada", flag: "🇬🇩" },
    { name: "Guatemala", flag: "🇬🇹" },
    { name: "Guinea", flag: "🇬🇳" },
    { name: "Guinea-Bissau", flag: "🇬🇼" },
    { name: "Guyana", flag: "🇬🇾" },
    { name: "Haiti", flag: "🇭🇹" },
    { name: "Honduras", flag: "🇭🇳" },
    { name: "Hungary", flag: "🇭🇺" },
    { name: "Iceland", flag: "🇮🇸" },
    { name: "India", flag: "🇮🇳" },
    { name: "Indonesia", flag: "🇮🇩" },
    { name: "Iran", flag: "🇮🇷" },
    { name: "Iraq", flag: "🇮🇶" },
    { name: "Ireland", flag: "🇮🇪" },
    { name: "Israel", flag: "🇮🇱" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "Jamaica", flag: "🇯🇲" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Jordan", flag: "🇯🇴" },
    { name: "Kazakhstan", flag: "🇰🇿" }
].sort((a, b) => a.name.localeCompare(b.name));

export default function CheckoutPage() {
    const { cartItems, totalPrice, totalDiscount, clearCart } = useCart();
    const { addToast } = useToast();
    const { data } = useData();
    const { user } = useAuth();
    const { isDark } = useTheme();
    const { translations } = useLanguage();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'United States'
    });

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

    // Auto-fill user data when available
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                email: user.email_address || '',
                phone: user.phone_number || ''
            }));
        }
    }, [user]);

    // Animation visibility
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedPaymentMethod) {
            addToast('Please select a payment method', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare order data
            const orderData = {
                products: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: item.final_price || item.price,
                    quantity: item.quantity,
                    selectedColor: item.selectedColor,
                    selectedSize: item.selectedSize
                })),
                total: totalPrice,
                discount: totalDiscount,
                country: formData.country,
                city: formData.city,
                postcode: 'none',
                address: formData.address,
                paymentMethodId: selectedPaymentMethod,
                user_id: user?.id || null
            };

            // Create order
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create order');
            }

            // Clear cart and show success message
            clearCart();
            addToast('Order placed successfully!', 'success');
            
            // Redirect to order tracking page
            router.push(`/track-order?orderId=${data.id}`);
        } catch (error) {
            addToast(error instanceof Error ? error.message : 'Failed to place order', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <main className={`min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
                <div className={`${isDark ? 'bg-[#222]' : 'bg-white'} rounded-t-[2.5rem] min-h-[calc(100vh-4rem)]`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center py-16">
                            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t('checkout.emptyCart.title')}
                            </h2>
                            <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {t('checkout.emptyCart.description')}
                            </p>
                            <Link 
                                href="/shop"
                                className={`px-6 py-3 rounded-md transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-black text-white hover:bg-black/80'
                                }`}
                            >
                                {t('checkout.emptyCart.continueShopping')}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={`min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
            <div className={`min-h-[calc(100vh-4rem)] ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Checkout Form */}
                        <div className={`transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t('checkout.title')}
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="pt-4">
                                    <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t('checkout.personalInfo.title')}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <label htmlFor="username" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                {t('checkout.personalInfo.fullName.label')} {user && <span className="text-xs text-gray-500">{t('checkout.personalInfo.fromProfile')}</span>}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    required
                                                    readOnly={!!user}
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className={`pl-10 block w-full rounded-lg border px-4 py-2.5 ${
                                                        isDark
                                                            ? 'bg-[#333] border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20'
                                                            : 'bg-white border-gray-300 text-gray-900 focus:border-[#009450] focus:ring-[#009450]'
                                                    } ${user ? 'cursor-not-allowed' : ''}`}
                                                    placeholder={t('checkout.personalInfo.fullName.placeholder')}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="relative">
                                            <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                {t('checkout.personalInfo.email.label')} {user && <span className="text-xs text-gray-500">{t('checkout.personalInfo.fromProfile')}</span>}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    readOnly={!!user}
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={`pl-10 block w-full rounded-lg border px-4 py-2.5 ${
                                                        isDark
                                                            ? 'bg-[#333] border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20'
                                                            : 'bg-white border-gray-300 text-gray-900 focus:border-[#009450] focus:ring-[#009450]'
                                                    } ${user ? 'cursor-not-allowed' : ''}`}
                                                    placeholder={t('checkout.personalInfo.email.placeholder')}
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="phone" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                {t('checkout.personalInfo.phone.label')} {user?.phone_number && <span className="text-xs text-gray-500">{t('checkout.personalInfo.fromProfile')}</span>}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    required
                                                    readOnly={!!user?.phone_number}
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className={`pl-10 block w-full rounded-lg border px-4 py-2.5 ${
                                                        isDark
                                                            ? 'bg-[#333] border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20'
                                                            : 'bg-white border-gray-300 text-gray-900 focus:border-[#009450] focus:ring-[#009450]'
                                                    } ${user?.phone_number ? 'cursor-not-allowed' : ''}`}
                                                    placeholder={t('checkout.personalInfo.phone.placeholder')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="pt-4">
                                    <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t('checkout.shippingAddress.title')}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label htmlFor="address" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                {t('checkout.shippingAddress.street.label')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="address"
                                                    name="address"
                                                    required
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className={`pl-10 block w-full rounded-lg border px-4 py-2.5 ${
                                                        isDark
                                                            ? 'bg-[#333] border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20'
                                                            : 'bg-white border-gray-300 text-gray-900 focus:border-[#009450] focus:ring-[#009450]'
                                                    }`}
                                                    placeholder={t('checkout.shippingAddress.street.placeholder')}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <label htmlFor="city" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    {t('checkout.shippingAddress.city.label')}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        name="city"
                                                        required
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className={`pl-10 block w-full rounded-lg border px-4 py-2.5 ${
                                                            isDark
                                                                ? 'bg-[#333] border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20'
                                                                : 'bg-white border-gray-300 text-gray-900 focus:border-[#009450] focus:ring-[#009450]'
                                                        }`}
                                                        placeholder={t('checkout.shippingAddress.city.placeholder')}
                                                    />
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <label htmlFor="state" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    {t('checkout.shippingAddress.state.label')}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="state"
                                                        name="state"
                                                        required
                                                        value={formData.state}
                                                        onChange={handleInputChange}
                                                        className={`pl-10 block w-full rounded-lg border px-4 py-2.5 ${
                                                            isDark
                                                                ? 'bg-[#333] border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20'
                                                                : 'bg-white border-gray-300 text-gray-900 focus:border-[#009450] focus:ring-[#009450]'
                                                        }`}
                                                        placeholder={t('checkout.shippingAddress.state.placeholder')}
                                                    />
                                                </div>
                                            </div>

                                            <div className="relative sm:col-span-2">
                                                <label htmlFor="country" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    {t('checkout.shippingAddress.country.label')}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <select
                                                        id="country"
                                                        name="country"
                                                        required
                                                        value={formData.country}
                                                        onChange={handleInputChange}
                                                        className={`pl-10 block w-full rounded-lg border px-4 py-2.5 ${
                                                            isDark
                                                                ? 'bg-[#333] border-gray-600 text-white focus:border-white focus:ring-white/20'
                                                                : 'bg-white border-gray-300 text-gray-900 focus:border-[#009450] focus:ring-[#009450]'
                                                        }`}
                                                    >
                                                        {countries.map((country) => (
                                                            <option 
                                                                key={country.name} 
                                                                value={country.name}
                                                                className={`flex items-center gap-2 ${isDark ? 'bg-[#333]' : 'bg-white'}`}
                                                            >
                                                                {country.flag} {country.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className={`transition-all duration-700 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t('checkout.orderSummary.title')}
                            </h2>
                            
                            {/* Cart Items */}
                            <div className="space-y-4 mb-8">
                                {cartItems.map((item) => (
                                    <div 
                                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} 
                                        className={`flex gap-4 p-4 items-center rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border ${
                                            isDark 
                                                ? 'bg-[#2A2A2A] border-gray-600'
                                                : 'bg-white border-gray-100'
                                        }`}
                                    >
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-sm font-semibold truncate transition-colors duration-200 ${
                                                isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-black'
                                            }`}>
                                                {item.name}
                                            </h3>
                                            <div className="mt-1.5 flex items-center gap-2 text-sm">
                                                {item.selectedColor && (
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${
                                                        isDark ? 'bg-[#333]' : 'bg-gray-50'
                                                    }`}>
                                                        <span className="w-3 h-3 rounded-full ring-1 ring-gray-200" style={{ backgroundColor: item.selectedColor }} />
                                                        <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {t('checkout.orderSummary.item.color')}
                                                        </span>
                                                    </span>
                                                )}
                                                {item.selectedSize && (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        isDark ? 'bg-[#333] text-gray-300' : 'bg-gray-50 text-gray-700'
                                                    }`}>
                                                        {t('checkout.orderSummary.item.size')}: {item.selectedSize}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                                                    isDark ? 'bg-[#333] text-gray-300' : 'bg-gray-50 text-gray-600'
                                                }`}>
                                                    {t('checkout.orderSummary.item.quantity')}: {item.quantity}
                                                </span>
                                                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    ${((item.final_price || item.price) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Options */}
                            <div className="pt-4 mb-8">
                                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {t('checkout.payment.title')}
                                </h3>
                                <div className="space-y-4">
                                    {data.paymentMethods.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {data.paymentMethods.map((method) => (
                                                <label
                                                    key={method.id}
                                                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                        selectedPaymentMethod === method.id
                                                            ? isDark 
                                                                ? 'border-white/20 bg-[#333]'
                                                                : 'border-black/10 bg-black/10'
                                                            : isDark
                                                                ? 'border-gray-600 hover:border-gray-500'
                                                                : 'border-gray-200 hover:border-[#000]/50'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value={method.id}
                                                        checked={selectedPaymentMethod === method.id}
                                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                                        className="sr-only"
                                                    />
                                                    <div className="flex items-center gap-4">
                                                        {method.icon && (
                                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                                                <Image
                                                                    src={method.icon}
                                                                    alt={method.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <span className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                {method.title}
                                                            </span>
                                                            {method.price > 0 && (
                                                                <span className={`block text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    {t('checkout.payment.fee')}: ${method.price.toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {selectedPaymentMethod === method.id && (
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                                isDark ? 'bg-white text-black' : 'bg-[#000] text-white'
                                                            }`}>
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {t('checkout.payment.noMethods')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className={`rounded-xl p-6 ${isDark ? 'bg-[#2A2A2A]' : 'bg-gray-50'}`}>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                            {t('checkout.total.subtotal')}
                                        </span>
                                        <span className={isDark ? 'text-white' : 'text-gray-900'}>
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                                {t('checkout.total.discount')}
                                            </span>
                                            <span className="text-green-600">
                                                -${totalDiscount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                            {t('checkout.total.shipping')}
                                        </span>
                                        <span className={isDark ? 'text-white' : 'text-gray-900'}>
                                            {t('checkout.total.shippingValue')}
                                        </span>
                                    </div>
                                    <div className={`border-t pt-4 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                                        <div className="flex justify-between">
                                            <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {t('checkout.total.total')}
                                            </span>
                                            <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                ${(totalPrice - totalDiscount).toFixed(2)}
                                            </span>       
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full h-14 mt-4 rounded-md font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDark 
                                        ? 'bg-white text-black hover:bg-gray-200 shadow-white/20'
                                        : 'bg-black text-white hover:bg-black/80 shadow-[#009450]/20'
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('checkout.placeOrder.processing')}
                                    </span>
                                ) : t('checkout.placeOrder.button')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 