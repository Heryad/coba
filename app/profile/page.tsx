'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import Button from '@/app/components/Button';
import OrderItemCard from '@/app/components/OrderItemCard';

// Mock data for orders
const mockOrders = [
  {
    id: '1',
    date: '2024-03-15',
    status: 'delivered' as const,
    total: 299.99,
    items: [
      {
        id: '1',
        product_name: 'Classic White T-Shirt',
        price: 29.99,
        quantity: 2,
        image_url: '/images/products/tshirt.jpg'
      },
      {
        id: '2',
        product_name: 'Slim Fit Jeans',
        price: 79.99,
        quantity: 1,
        image_url: '/images/products/jeans.jpg'
      }
    ]
  },
  {
    id: '2',
    date: '2024-03-10',
    status: 'processing' as const,
    total: 149.99,
    items: [
      {
        id: '3',
        product_name: 'Leather Jacket',
        price: 149.99,
        quantity: 1,
        image_url: '/images/products/jacket.jpg'
      }
    ]
  }
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/invite/${user?.id}`;
    navigator.clipboard.writeText(inviteLink);
    // You can add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Banner */}
      <div className="relative h-[300px] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={user?.photo_url || '/images/placeholder-avatar.jpg'}
                alt={user?.username || 'Profile'}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">
                {user?.username || 'User'}
              </h1>
              <p className="text-gray-300 mt-1">
                {user?.email_address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-black text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-black text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Orders
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <div className="space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={user?.email_address || ''}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={user?.phone_number || ''}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Referral Program */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Referral Program</h2>
              <p className="text-gray-600 mb-6">
                Invite your friends and earn 10% commission on their first purchase!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  readOnly
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
                <Button onClick={handleCopyInviteLink}>
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <OrderItemCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 