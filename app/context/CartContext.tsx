'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    final_price?: number;
    discount?: number;
    quantity: number;
    image: string;
    selectedColor?: string;
    selectedSize?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, selectedColor?: string, selectedSize?: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    totalDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Calculate totals
        const items = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        const price = cartItems.reduce((acc, item) => {
            const itemPrice = item.final_price || item.price;
            return acc + (itemPrice * item.quantity);
        }, 0);
        const discount = cartItems.reduce((acc, item) => {
            if (item.discount && item.discount > 0) {
                const originalPrice = item.price * item.quantity;
                const discountedPrice = (item.final_price || item.price) * item.quantity;
                return acc + (originalPrice - discountedPrice);
            }
            return acc;
        }, 0);
        
        setTotalItems(items);
        setTotalPrice(price);
        setTotalDiscount(discount);
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(
                i => i.id === item.id && 
                i.selectedColor === item.selectedColor && 
                i.selectedSize === item.selectedSize
            );

            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id && 
                    i.selectedColor === item.selectedColor && 
                    i.selectedSize === item.selectedSize
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }

            return [...prevItems, item];
        });
    };

    const removeFromCart = (id: string, selectedColor?: string, selectedSize?: string) => {
        setCartItems(prev => prev.filter(item => 
            !(item.id === id && 
              item.selectedColor === selectedColor && 
              item.selectedSize === selectedSize)
        ));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            totalDiscount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
} 