import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState } from 'react';
import RatingModal from './RatingModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import { StarIcon } from '@heroicons/react/24/outline';

interface OrderItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image_url: string;
}

interface OrderItemCardProps {
  order: {
    id: string;
    date: string;
    status: 'pending' | 'accepted' | 'processing' | 'delivered';
    total: number;
    items: OrderItem[];
  };
}

export default function OrderItemCard({ order }: OrderItemCardProps) {
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {user} = useAuth();
  const { addToast } = useToast();

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const handleRatingSubmit = async (rating: { stars: number; description: string }) => {
    if (!selectedItem || !user) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: selectedItem.id,
          user_id: user?.id,
          stars: rating.stars,
          description: rating.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      setIsRatingModalOpen(false);
      setSelectedItem(null);
      addToast('Review Submitted Successfully', 'success');
    } catch (error) {
      addToast(`${error || 'Error Submitting Review'}`, 'error');
      setIsRatingModalOpen(false);
      setSelectedItem(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 animate-fadeIn">
      {/* Order Header */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(order.date), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${statusColors[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className="text-lg font-semibold text-gray-900">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="divide-y divide-gray-50">
        {order.items.map((item) => (
          <div key={item.id + item.quantity + item.selectedSize + item.selectedColor} 
               className="p-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors duration-200 animate-fadeIn">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
              <Image
                src={item.image_url}
                alt={item.product_name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate hover:text-black transition-colors duration-200">
                {item.product_name}
              </h4>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-sm text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                  Qty: {item.quantity}
                </span>
                {item.selectedColor && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-full">
                    <span className="w-3 h-3 rounded-full ring-1 ring-gray-200" style={{ backgroundColor: item.selectedColor }} />
                    <span className="text-xs font-medium text-gray-600">Color</span>
                  </span>
                )}
                {item.selectedSize && (
                  <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600">
                    Size: {item.selectedSize}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              {order.status === 'delivered' && (
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setIsRatingModalOpen(true);
                  }}
                  className="text-amber-400 hover:text-amber-500 transition-colors p-1.5 rounded-full hover:bg-amber-50"
                  title="Rate Product"
                >
                  <StarIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Footer */}
      <div className="p-6 bg-gray-50/50 border-t border-gray-50">
        <Link 
          href={`/track-order?orderId=${order.id}`}
          className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-black transition-colors duration-200 group"
        >
          View Details
          <svg 
            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Rating Modal */}
      {selectedItem && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false);
            setSelectedItem(null);
          }}
          onSubmit={handleRatingSubmit}
          productName={selectedItem.product_name}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}