'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Table, { Column } from '../components/Table'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import { EyeIcon } from '@heroicons/react/24/outline'

interface Order {
  id: string
  products: {
    id: string
    product_name: string
    quantity: number
    price: number
    total: number
  }[]
  total: number
  discount: number
  status: 'pending' | 'accepted' | 'processing' | 'delivered'
  created_at: string
}

interface User {
  id: string
  username: string
  email_address: string
  phone_number: string | null
  photo_url: string | null
  total_orders: number
  created_at: string
  orders?: Order[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const supabase = createClientComponentClient()

  const columns: Column<User>[] = [
    {
      key: 'photo_url',
      title: 'Photo',
      render: (value, user) => (
        <img
          src={value || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
        />
      ),
    },
    {
      key: 'username',
      title: 'Username',
      sortable: true,
    },
    {
      key: 'email_address',
      title: 'Email',
    },
    {
      key: 'phone_number',
      title: 'Phone',
      render: (value) => value || '-',
    },
    {
      key: 'total_orders',
      title: 'Orders',
      sortable: true,
    },
    {
      key: 'created_at',
      title: 'Joined',
      type: 'date',
      sortable: true,
    },
  ]

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users_table')
        .select()
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserOrders = async (userId: string) => {
    setLoadingOrders(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return []
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleSort = async (key: keyof User, direction: 'asc' | 'desc') => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users_table')
        .select()
        .order(key, { ascending: direction === 'asc' })

      if (error) throw error
      setUsers(data)
    } catch (error) {
      console.error('Error sorting users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrders = async (user: User) => {
    const orders = await fetchUserOrders(user.id)
    setSelectedUser({ ...user, orders })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const ActionButton = ({ item }: { item: User }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleViewOrders(item)
        }}
        className="inline-flex items-center gap-1 px-2 py-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
        title="View Orders"
      >
        <EyeIcon className="h-4 w-4" />
        <span className="text-xs font-medium">View Orders</span>
      </button>
    )
  }

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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users including their profile information and order history.
          </p>
        </div>
      </div>

      <Table
        data={users}
        columns={columns}
        isLoading={loading}
        onSort={handleSort}
        showDelete={false}
        actionButton={ActionButton}
        actionColumnTitle="Actions"
      />

      {/* User Orders Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Order History - ${selectedUser.username}`}
        >
          <div className="space-y-6">
            {/* User Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">User Information</h3>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Username</p>
                  <p>{selectedUser.username}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Email</p>
                  <p>{selectedUser.email_address}</p>
                </div>
                {selectedUser.phone_number && (
                  <div>
                    <p className="font-medium text-gray-500">Phone</p>
                    <p>{selectedUser.phone_number}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-500">Total Orders</p>
                  <p>{selectedUser.total_orders}</p>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              {loadingOrders ? (
                <div className="mt-4 flex justify-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : selectedUser.orders && selectedUser.orders.length > 0 ? (
                <div className="mt-4 flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                              Order ID
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Items
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Total
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Status
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedUser.orders.map((order) => (
                            <tr key={order.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                                {order.id.slice(0, 8)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                                {order.products.length}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                                ${(order.total - order.discount).toFixed(2)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <Badge
                                  label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  variant={getStatusBadgeVariant(order.status)}
                                />
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No orders found for this user.</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
