'use client';

import { useCart } from '@/app/context/CartContext';
import { useToast } from '@/app/context/ToastContext';
import { useData } from '@/app/context/DataProvider';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function CheckoutPage() {
    const { cartItems, totalPrice, totalDiscount, clearCart } = useCart();
    const { addToast } = useToast();
    const { data } = useData();
    const { user } = useAuth();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    // Animation visibility
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                postcode: formData.zipCode,
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
            <main className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="bg-white rounded-t-[2.5rem] min-h-[calc(100vh-4rem)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center py-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8">Add some items to your cart before checking out</p>
                            <Link 
                                href="/shop"
                                className="px-6 py-3 bg-black text-white rounded-md hover:bg-black/80 transition-all duration-300"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white min-h-screen">
            <div className="bg-white min-h-[calc(100vh-4rem)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Checkout Form */}
                        <div className={`transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout Information</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="pt-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                required
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#009450] focus:ring-[#009450]"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#009450] focus:ring-[#009450]"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#009450] focus:ring-[#009450]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="pt-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#009450] focus:ring-[#009450]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#009450] focus:ring-[#009450]"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    name="state"
                                                    required
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#009450] focus:ring-[#009450]"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    id="zipCode"
                                                    name="zipCode"
                                                    required
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#009450] focus:ring-[#009450]"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    name="country"
                                                    required
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#009450] focus:ring-[#009450]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className={`transition-all duration-700 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            {/* Cart Items */}
                            <div className="space-y-4 mb-8">
                                {cartItems.map((item) => (
                                    <div 
                                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} 
                                        className="flex gap-4 p-4 bg-white items-center rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
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
                                            <h3 className="text-sm font-semibold text-gray-900 truncate hover:text-black transition-colors duration-200">
                                                {item.name}
                                            </h3>
                                            <div className="mt-1.5 flex items-center gap-2 text-sm text-gray-500">
                                                {item.selectedColor && (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-full">
                                                        <span className="w-3 h-3 rounded-full ring-1 ring-gray-200" style={{ backgroundColor: item.selectedColor }} />
                                                        <span className="text-xs font-medium">Color</span>
                                                    </span>
                                                )}
                                                {item.selectedSize && (
                                                    <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-medium">
                                                        Size: {item.selectedSize}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                                                    Qty: {item.quantity}
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    ${((item.final_price || item.price) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Options */}
                            <div className="pt-4 mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                                <div className="space-y-4">
                                    {data.paymentMethods.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {data.paymentMethods.map((method) => (
                                                <label
                                                    key={method.id}
                                                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                        selectedPaymentMethod === method.id
                                                            ? 'border-black/10 bg-black/10'
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
                                                            <span className="block text-sm font-medium text-gray-900">
                                                                {method.title}
                                                            </span>
                                                            {method.price > 0 && (
                                                                <span className="block text-sm text-gray-500">
                                                                    Fee: ${method.price.toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {selectedPaymentMethod === method.id && (
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                            <div className="w-5 h-5 rounded-full bg-[#000] flex items-center justify-center">
                                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600">No payment methods available</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="text-green-600">-${totalDiscount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-gray-900">Free</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-base font-bold">Total</span>
                                            <span className="text-base font-bold">${(totalPrice - totalDiscount).toFixed(2)}</span>       
                                        </div>
                                    </div>
                                </div>
                            </div>

                             {/* Submit Button */}
                             <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full h-14 mt-4 rounded-md bg-black text-white font-medium hover:bg-black/80 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#009450]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing Order...
                                        </span>
                                    ) : 'Place Order'}
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 