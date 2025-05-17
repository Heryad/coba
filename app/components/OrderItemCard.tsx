import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
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
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-purple-100 text-purple-800',
    processing: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Order Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(order.date), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className="text-lg font-semibold text-gray-900">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="divide-y divide-gray-100">
        {order.items.map((item) => (
          <div key={item.id} className="p-6 flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.image_url}
                alt={item.product_name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.product_name}
              </h4>
              <p className="text-sm text-gray-500">
                Quantity: {item.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Order Footer */}
      <div className="p-6 bg-gray-50">
        <Link 
          href={`/track-order?orderId=${order.id}`}
          className="text-sm font-medium text-gray-900 hover:text-gray-700"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
} 