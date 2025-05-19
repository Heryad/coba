'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import Button from '@/app/components/Button';
import OrderItemCard from '@/app/components/OrderItemCard';
import placeholder_avatar from '@/public/images/placeholder_avatar.png'
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/app/context/ToastContext';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';


// Define types to match fetched data and OrderItemCard props
interface FetchedOrderItem {
  id: string;
  name: string;
  image: string; // Matches 'image' in the checkout data, assuming this is photo_url
  price: number; // Matches 'price' or 'final_price'
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface FetchedOrder {
  id: string;
  products: FetchedOrderItem[]; // jsonb column in schema
  total: number; // numeric/decimal in schema
  discount: number; // numeric/decimal in schema
  promo_code: string | null;
  country: string;
  city: string;
  postcode: string | null;
  address: string;
  payment_method_id: string; // uuid in schema, use string in frontend
  status: string; // text in schema, need to map to specific literals
  user_id: string; // uuid in schema, use string in frontend
  created_at: string; // timestamp with time zone in schema
}

// Type expected by OrderItemCard
interface OrderForCard {
  id: string;
  date: string;
  status: 'pending' | 'accepted' | 'processing' | 'delivered'; // Status type for rendering (matches OrderItemCard)
  total: number;
  items: {
    id: string;
    product_name: string;
    price: number;
    quantity: number;
    image_url: string;
    selectedSize: string;
    selectedColor: string;
  }[]; // Match OrderItem structure
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [refLink, setRefLink] = useState('');
  const [userOrders, setUserOrders] = useState<OrderForCard[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [form, setForm] = useState({
    username: user?.username || '',
    email_address: user?.email_address || '',
    phone_number: user?.phone_number || '',
    photo_url: user?.photo_url || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL + '/auth?tab=signup&ref=' + user?.id}`;
    navigator.clipboard.writeText(inviteLink);
    // You can add a toast notification here
    addToast('Referral Link Copied !', 'info');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    // Ensure user and user.id exist before attempting to save
    if (!user || !user.id) {
      addToast('User not authenticated or user ID not available.', 'error');
      return;
    }

    if (form.username ! == '') {
      addToast('Username cannot be empty', 'error');
      setIsEditing(false);

      setForm({username: user?.username || '',
        email_address: user?.email_address || '',
        phone_number: user?.phone_number || '',
        photo_url: user?.photo_url || ''})
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...form }),
      });
      const data = await res.json();
      if (res.ok) {
        // In a real app, you might want to refetch user or update context
        setIsEditing(false);
        addToast('Profile updated successfully!', 'success');
      } else {
        addToast(data.error || 'Failed to update profile', 'error');
      }
    } catch (err) {
      addToast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email_address: user.email_address || '',
        phone_number: user.phone_number || '',
        photo_url: user.photo_url || '',
      });
      setRefLink(process.env.NEXT_PUBLIC_APP_URL + '/auth?tab=signup&ref=' + user.id);

      // Fetch user orders
      const fetchUserOrders = async () => {
        setOrdersLoading(true);
        try {
          const res = await fetch('/api/orders/fetchByUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          });
          const data: { orders?: FetchedOrder[], error?: string } = await res.json();
          if (res.ok) {
            // Filter orders by supported statuses before mapping to the structure expected by OrderItemCard
            const formattedOrders: OrderForCard[] = (data.orders || [])
              .filter(order => ['pending', 'accepted', 'processing', 'delivered'].includes(order.status))
              .map(order => ({
                id: order.id,
                date: format(new Date(order.created_at), 'yyyy-MM-dd'),
                status: order.status as 'pending' | 'accepted' | 'processing' | 'delivered',
                total: parseFloat(order.total.toString()),
                items: order.products.map(item => ({
                  id: item.id,
                  product_name: item.name,
                  price: parseFloat(item.price.toString()),
                  quantity: item.quantity,
                  image_url: item.image,
                  selectedSize: item.selectedSize,
                  selectedColor: item.selectedColor
                }))
              }));
            setUserOrders(formattedOrders);
          } else {
            addToast(data.error || 'Failed to fetch orders', 'error');
            setUserOrders([]);
          }
        } catch (err: any) {
          addToast(err.message || 'Failed to fetch orders', 'error');
          setUserOrders([]);
        } finally {
          setOrdersLoading(false);
        }
      };

      fetchUserOrders();

    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white pb-12">
        <div className="relative h-[300px] bg-gray-200 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="border-b border-gray-200 mb-8 flex space-x-8">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="h-10 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-36 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-64 bg-gray-200 rounded mb-6"></div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                <div className="h-10 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>

            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                 <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                       <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                       <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                 </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Banner */}
      <div className="relative h-[300px] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={user?.photo_url || placeholder_avatar}
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
              onClick={() => handleTabChange('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-black text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile Details
            </button>
            <button
              onClick={() => handleTabChange('orders')}
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
            <div className="bg-gray-100 rounded-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {isEditing ? (
                  <Button
                    variant="primary"
                    onClick={handleProfileUpdate}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      name="username"
                      type="text"
                      value={form.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="block w-full rounded-md border-gray-300 focus:border-black focus:ring-black sm:text-sm disabled:bg-gray-50 h-12 pl-10 pr-2"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                   <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      name="email_address"
                      type="email"
                      value={form.email_address}
                      onChange={handleInputChange}
                      disabled={true}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm disabled:bg-gray-50 h-12 pl-10 pr-2 cursor-not-allowed"
                    />
                   </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                   <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      name="phone_number"
                      type="tel"
                      value={form.phone_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm disabled:bg-gray-50 h-12 pl-10 pr-2"
                    />
                   </div>
                </div>
              </div>
            </div>

            {/* Referral Program */}
            <div className="bg-gray-100 rounded-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Referral Program</h2>
              <p className="text-gray-600 mb-6">
                Invite your friends and earn 10% commission on their first purchase!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                
                <input
                  type="text"
                  readOnly
                  value={refLink}
                  className="flex-1 rounded-md pl-2 border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
                <Button onClick={handleCopyInviteLink}>
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {ordersLoading ? (
               // Skeleton for orders loading
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-6 animate-pulse h-48"></div>
              ))
            ) : userOrders.length > 0 ? (
              userOrders.map((order) => (
                <OrderItemCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No orders found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 