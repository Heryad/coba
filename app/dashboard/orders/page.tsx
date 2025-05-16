'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Table, { Column } from '../components/Table'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import LoadingSpinner from '../components/LoadingSpinner'

interface OrderProduct {
  id: string
  product_name: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  products: OrderProduct[]
  total: number
  discount: number
  promo_code: string | null
  country: string
  city: string
  postcode: string | null
  address: string
  payment_method_id: string
  status: 'pending' | 'accepted' | 'processing' | 'delivered'
  user_id: string
  created_at: string
  users: {
    username: string
    email_address: string
    phone_number: string | null
  }
  payment_methods: {
    title: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const supabase = createClientComponentClient()

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'accepted':
        return 'info'
      case 'processing':
        return 'info'
      case 'delivered':
        return 'success'
      default:
        return 'default'
    }
  }

  const columns: Column<Order>[] = [
    {
      key: 'id',
      title: 'Order ID',
      render: (value) => value.slice(0, 8),
    },
    {
      key: 'users',
      title: 'Customer',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.username}</div>
          <div className="text-gray-500 text-xs">{value?.email_address}</div>
        </div>
      ),
    },
    {
      key: 'total',
      title: 'Total',
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: 'payment_methods',
      title: 'Payment',
      render: (value) => value?.title || 'Unknown',
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <Badge
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          variant={getStatusBadgeVariant(value)}
        />
      ),
    },
    {
      key: 'created_at',
      title: 'Order Date',
      type: 'date',
      sortable: true,
    },
  ]

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users:users_table(username, email_address, phone_number),
          payment_methods(title)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = async (key: keyof Order, direction: 'asc' | 'desc') => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users:users_table(username, email_address, phone_number),
          payment_methods(title)
        `)
        .order(key, { ascending: direction === 'asc' })

      if (error) throw error
      setOrders(data)
    } catch (error) {
      console.error('Error sorting orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (order: Order, newStatus: Order['status']) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id)

      if (error) throw error

      // Update local state
      setOrders(orders.map(o => 
        o.id === order.id ? { ...o, status: newStatus } : o
      ))
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const ActionButton = ({ item }: { item: Order }) => {
    const nextStatus = (): Order['status'] => {
      switch (item.status) {
        case 'pending':
          return 'accepted'
        case 'accepted':
          return 'processing'
        case 'processing':
          return 'delivered'
        default:
          return item.status
      }
    }

    if (item.status === 'delivered') return null

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleStatusChange(item, nextStatus())
        }}
        className="inline-flex items-center gap-1 px-2 py-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
        title={`Mark as ${nextStatus()}`}
        disabled={isSubmitting}
      >
        <span className="text-xs font-medium">
          {isSubmitting ? 'Updating...' : `→ ${nextStatus()}`}
        </span>
      </button>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders including customer details, total amount, and current status.
          </p>
        </div>
      </div>

      <Table
        data={orders}
        columns={columns}
        isLoading={loading}
        onSort={handleSort}
        showDelete={false}
        actionButton={ActionButton}
        actionColumnTitle="Actions"
        onRowClick={setSelectedOrder}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details - ${selectedOrder.id.slice(0, 8)}`}
        >
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Name</p>
                  <p>{selectedOrder.users.username}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Email</p>
                  <p>{selectedOrder.users.email_address}</p>
                </div>
                {selectedOrder.users.phone_number && (
                  <div>
                    <p className="font-medium text-gray-500">Phone</p>
                    <p>{selectedOrder.users.phone_number}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
              <div className="mt-2 text-sm">
                <p>{selectedOrder.address}</p>
                <p>{selectedOrder.city}, {selectedOrder.postcode}</p>
                <p>{selectedOrder.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
              <div className="mt-2">
                <div className="flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                              Product
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Qty
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Price
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedOrder.products.map((product) => (
                            <tr key={product.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                                {product.product_name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                                {product.quantity}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                                ${product.price.toFixed(2)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                                ${product.total.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th scope="row" colSpan={3} className="pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900">
                              Subtotal
                            </th>
                            <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500">
                              ${selectedOrder.total.toFixed(2)}
                            </td>
                          </tr>
                          {selectedOrder.discount > 0 && (
                            <tr>
                              <th scope="row" colSpan={3} className="pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900">
                                Discount
                              </th>
                              <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500">
                                -${selectedOrder.discount.toFixed(2)}
                              </td>
                            </tr>
                          )}
                          <tr>
                            <th scope="row" colSpan={3} className="pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900">
                              Total
                            </th>
                            <td className="pl-3 pr-4 pt-4 text-right text-sm font-bold text-gray-900">
                              ${(selectedOrder.total - selectedOrder.discount).toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <Badge
                    label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    variant={getStatusBadgeVariant(selectedOrder.status)}
                  />
                </div>
                {selectedOrder.status !== 'delivered' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder, nextStatus(selectedOrder.status))}
                    disabled={isSubmitting}
                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <LoadingSpinner size="sm" color="white" />
                        Updating...
                      </span>
                    ) : (
                      `Mark as ${nextStatus(selectedOrder.status)}`
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function nextStatus(status: Order['status']): Order['status'] {
  switch (status) {
    case 'pending':
      return 'accepted'
    case 'accepted':
      return 'processing'
    case 'processing':
      return 'delivered'
    default:
      return status
  }
}
