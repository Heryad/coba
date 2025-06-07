"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  FolderIcon, 
  StarIcon, 
  CreditCardIcon,
  PhotoIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// Initialize Supabase client
const supabase = createClientComponentClient();

// Types for component props
interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  isLoading: boolean;
  changeText?: string;
  bgColor?: string;
  decorationColor?: string;
}

interface OrderStatusCardProps {
  title: string;
  pending: number;
  processing: number;
  delivered: number;
  isLoading: boolean;
}

interface ProductType {
  id: string;
  product_name: string;
  category_name: string;
  rating: number;
  price: number;
  photos_url: string[];
}

interface TopProductsCardProps {
  products: ProductType[];
  isLoading: boolean;
}

interface OrderType {
  id: string;
  user: string;
  date: string;
  total: number;
  status: string;
}

interface RecentOrdersCardProps {
  orders: OrderType[];
  isLoading: boolean;
}

// Supabase response interfaces
interface ProductWithCategory {
  id: string;
  product_name: string;
  price: number;
  rating: number;
  photos_url: string[];
  category_id: string;
  categories_table: { category_name: string } | null;
}

interface OrderWithUser {
  id: string;
  total: number;
  status: string;
  created_at: string;
  user_id: string;
  users_table: { username: string } | null;
}

interface OrderStatusData {
  pending: number;
  processing: number;
  delivered: number;
}

interface ChangePercentages {
  users: number;
  products: number;
  orders: number;
  revenue: number;
  reviews: number;
  posts: number;
}

// Analytics Dashboard Card component
function AnalyticsCard({ title, value, icon, change, isLoading, changeText, bgColor, decorationColor = 'bg-gray-200' }: AnalyticsCardProps) {
  return (
    <div className={`rounded-xl shadow-sm ${bgColor || 'bg-white'} p-6 relative overflow-hidden`}>
      {/* Background decoration */}
      <div className={`absolute -right-3 -top-3 w-24 h-24 rounded-full ${decorationColor} opacity-30`}></div>
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {isLoading ? (
            <div className="mt-2 h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <h3 className="mt-1 text-2xl font-bold">{value}</h3>
          )}
          
          {change !== undefined && !isLoading && (
            <div className={`mt-1 flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(change)}% {changeText || (change >= 0 ? 'increase' : 'decrease')}</span>
            </div>
          )}
        </div>
        <span className="text-gray-500">
          {icon}
        </span>
      </div>
    </div>
  );
}

// Order Status Card component
function OrderStatusCard({ title, pending, processing, delivered, isLoading }: OrderStatusCardProps) {
  const hasData = pending > 0 || processing > 0 || delivered > 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
        </div>
      ) : !hasData ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No order data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Pending</span>
            <div className="flex items-center">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full" style={{ width: `${pending}%` }}></div>
              </div>
              <span className="ml-2 text-sm font-medium">{pending}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Processing</span>
            <div className="flex items-center">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${processing}%` }}></div>
              </div>
              <span className="ml-2 text-sm font-medium">{processing}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Delivered</span>
            <div className="flex items-center">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: `${delivered}%` }}></div>
              </div>
              <span className="ml-2 text-sm font-medium">{delivered}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Top Products Card component
function TopProductsCard({ products, isLoading }: TopProductsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Top Selling Products</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 animate-pulse rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
              </div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-12"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index: number) => (
            <div key={product.id} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                {product.photos_url && product.photos_url.length > 0 ? (
                  <img 
                    src={product.photos_url[0]} 
                    alt={product.product_name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 truncate">{product.product_name}</h4>
                <p className="text-sm text-gray-500">{product.category_name}</p>
              </div>
              <div className="font-medium text-gray-800">${product.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Recent Orders Card component
function RecentOrdersCard({ orders, isLoading }: RecentOrdersCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Orders</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-14 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="p-3 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{order.user}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [paymentMethodsCount, setPaymentMethodsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [socialPostsCount, setSocialPostsCount] = useState(0);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData>({ pending: 0, processing: 0, delivered: 0 });
  const [topProducts, setTopProducts] = useState<ProductType[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderType[]>([]);
  
  // Fetch data on component mount
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        
        // Fetch counts from each table
        const [
          usersResponse,
          productsResponse,
          ordersResponse,
          categoriesResponse,
          paymentsResponse,
          reviewsResponse,
          postsResponse
        ] = await Promise.all([
          supabase.from('users_table').select('*', { count: 'exact', head: true }),
          supabase.from('products_table').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('categories_table').select('*', { count: 'exact', head: true }),
          supabase.from('payment_methods').select('*', { count: 'exact', head: true }),
          supabase.from('ratings').select('*', { count: 'exact', head: true }),
          supabase.from('community_posts').select('*', { count: 'exact', head: true })
        ]);
        
        // Set counts
        setUsersCount(usersResponse.count || 0);
        setProductsCount(productsResponse.count || 0);
        setOrdersCount(ordersResponse.count || 0);
        setCategoriesCount(categoriesResponse.count || 0);
        setPaymentMethodsCount(paymentsResponse.count || 0);
        setReviewsCount(reviewsResponse.count || 0);
        setSocialPostsCount(postsResponse.count || 0);
        
        // Calculate revenue from orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total');
          
        const totalRevenue = ordersData?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
        setRevenueTotal(totalRevenue);
        
        // Calculate order status distribution from real data
        const { data: ordersByStatus } = await supabase
          .from('orders')
          .select('status');
          
        if (ordersByStatus && ordersByStatus.length > 0) {
          const statusCounts: Record<string, number> = ordersByStatus.reduce((acc: Record<string, number>, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {});
          
          const total = ordersByStatus.length;
          setOrderStatusData({
            pending: Math.round((statusCounts['pending'] || 0) / total * 100),
            processing: Math.round((statusCounts['processing'] || 0) / total * 100),
            delivered: Math.round((statusCounts['delivered'] || 0) / total * 100)
          });
        } else {
          // Ensure we set zeros when there's no data
          setOrderStatusData({ pending: 0, processing: 0, delivered: 0 });
        }
        
        // Fetch top products by rating
        const { data: topProductsData, error: topProductsError } = await supabase
          .from('products_table')
          .select(`
            id,
            product_name,
            price,
            rating,
            photos_url,
            category_id,
            categories_table(category_name)
          `)
          .order('rating', { ascending: false })
          .limit(5);
        
        if (topProductsError) throw topProductsError;
        
        if (topProductsData) {
          // Cast the data to the correct type with joins
          const typedProductsData = topProductsData as unknown as ProductWithCategory[];
          
          const formattedProducts = typedProductsData.map(product => ({
            id: product.id,
            product_name: product.product_name,
            category_name: product.categories_table?.category_name || 'Uncategorized',
            rating: product.rating,
            price: product.price,
            photos_url: product.photos_url || []
          }));
          
          setTopProducts(formattedProducts);
        }
        
        // Fetch recent orders with user data
        const { data: recentOrdersData, error: recentOrdersError } = await supabase
          .from('orders')
          .select(`
            id,
            total,
            status,
            created_at,
            user_id,
            users_table(username)
          `)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentOrdersError) throw recentOrdersError;
        
        if (recentOrdersData) {
          // Cast the data to the correct type with joins
          const typedOrdersData = recentOrdersData as unknown as OrderWithUser[];
          
          const formattedOrders = typedOrdersData.map(order => {
            // Format the date to display
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric'
            });
            
            return {
              id: order.id,
              user: order.users_table?.username || 'Anonymous',
              date: formattedDate,
              total: order.total,
              status: order.status
            };
          });
          
          setRecentOrders(formattedOrders);
        }
      } catch (error) {
        //console.error('Error fetching dashboard data:', error);
      } finally {
        // Remove the timeout to make the dashboard respond faster
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);
  
  // Fake change percentages (would be calculated from real data in production)
  const changes: ChangePercentages = {
    users: 8.2,
    products: 5.3,
    orders: 12.7,
    revenue: 15.2,
    reviews: -2.4,
    posts: 9.8
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
        <div className="px-3 py-1.5 text-sm bg-[#009450] text-white rounded-md flex items-center">
          <span className="font-medium mr-1">Today:</span> {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {/* Main metrics grid - responsive for all device sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnalyticsCard 
          title="Total Users" 
          value={isLoading ? '' : usersCount.toLocaleString()} 
          icon={<UserIcon className="w-6 h-6" />}
          change={changes.users}
          isLoading={isLoading}
          bgColor="bg-white"
          decorationColor="bg-blue-500"
        />
        
        <AnalyticsCard 
          title="Total Products" 
          value={isLoading ? '' : productsCount.toLocaleString()} 
          icon={<ShoppingBagIcon className="w-6 h-6" />}
          change={changes.products}
          isLoading={isLoading}
          bgColor="bg-white"
          decorationColor="bg-emerald-500"
        />
        
        <AnalyticsCard 
          title="Total Orders" 
          value={isLoading ? '' : ordersCount.toLocaleString()} 
          icon={<ShoppingCartIcon className="w-6 h-6" />}
          change={changes.orders}
          isLoading={isLoading}
          bgColor="bg-white"
          decorationColor="bg-purple-500"
        />
        
        <AnalyticsCard 
          title="Total Revenue" 
          value={isLoading ? '' : `$${revenueTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          change={changes.revenue}
          isLoading={isLoading}
          bgColor="bg-white"
          decorationColor="bg-green-500"
        />
      </div>
      
      {/* Secondary metrics grid - responsive for all device sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnalyticsCard 
          title="Categories" 
          value={isLoading ? '' : categoriesCount.toLocaleString()} 
          icon={<FolderIcon className="w-6 h-6" />}
          isLoading={isLoading}
          bgColor="bg-white"
          decorationColor="bg-amber-500"
        />
        
        <AnalyticsCard 
          title="Payment Methods" 
          value={isLoading ? '' : paymentMethodsCount.toLocaleString()} 
          icon={<CreditCardIcon className="w-6 h-6" />}
          isLoading={isLoading}
          bgColor="bg-white"
          decorationColor="bg-indigo-500"
        />
        
        <AnalyticsCard 
          title="Reviews" 
          value={isLoading ? '' : reviewsCount.toLocaleString()} 
          icon={<StarIcon className="w-6 h-6" />}
          change={changes.reviews}
          isLoading={isLoading}
          bgColor="bg-white"
          decorationColor="bg-yellow-500"
        />
        
        <AnalyticsCard 
          title="Social Posts" 
          value={isLoading ? '' : socialPostsCount.toLocaleString()} 
          icon={<PhotoIcon className="w-6 h-6" />}
          change={changes.posts}
          isLoading={isLoading}
          bgColor="bg-white"
          decorationColor="bg-rose-500"
        />
      </div>
      
      {/* Detailed analytics grid - responsive layout that restructures on different screens */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Order status card takes full width on mobile, 1/4 on desktop */}
        <div className="lg:col-span-1">
          <OrderStatusCard 
            title="Order Status Distribution" 
            pending={orderStatusData.pending}
            processing={orderStatusData.processing}
            delivered={orderStatusData.delivered}
            isLoading={isLoading}
          />
        </div>
        
        {/* Top products and recent orders each take full width on mobile, 3/8 on desktop */}
        <div className="lg:col-span-2">
          <TopProductsCard products={topProducts} isLoading={isLoading} />
        </div>
        
        <div className="lg:col-span-1">
          <RecentOrdersCard orders={recentOrders} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}