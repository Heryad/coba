'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Table, { Column } from '../components/Table'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import LoadingSpinner from '../components/LoadingSpinner'
import { PlusIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { createPortal } from 'react-dom'

interface PaymentMethod {
  id: string
  title: string
  price: number
  icon: string | null
  is_active: boolean
  created_at: string
}

interface Image {
  id: string
  photo_url: string
  title: string | null
  placement: string | null
  color_code: string | null
  created_at: string
}

export default function PaymentMethodPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showImageDropdown, setShowImageDropdown] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [newMethod, setNewMethod] = useState({
    title: '',
    price: 0,
    is_active: true
  })
  const supabase = createClientComponentClient()

  const columns: Column<PaymentMethod>[] = [
    {
      key: 'icon',
      title: 'Icon',
      render: (value, item) => (
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
          {value ? (
            <img
              src={value}
              alt={item.title}
              className="h-6 w-6 object-contain"
            />
          ) : (
            <span className="text-gray-400 text-xl">💳</span>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      title: 'Method Name',
      sortable: true,
    },
    {
      key: 'price',
      title: 'Fee',
      sortable: true,
      render: (value) => value > 0 ? `$${value.toFixed(2)}` : 'Free',
    },
    {
      key: 'is_active',
      title: 'Status',
      render: (value) => (
        <Badge
          label={value ? 'Active' : 'Inactive'}
          variant={value ? 'success' : 'error'}
        />
      ),
    },
    {
      key: 'created_at',
      title: 'Added On',
      type: 'date',
      sortable: true,
    },
  ]

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select()
        .order('created_at', { ascending: false })

      if (error) throw error
      setPaymentMethods(data)
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  const handleSort = async (key: keyof PaymentMethod, direction: 'asc' | 'desc') => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select()
        .order(key, { ascending: direction === 'asc' })

      if (error) throw error
      setPaymentMethods(data)
    } catch (error) {
      console.error('Error sorting payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (method: PaymentMethod) => {
    if (!window.confirm('Are you sure you want to delete this payment method? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', method.id)

      if (error) throw error

      setPaymentMethods(paymentMethods.filter(m => m.id !== method.id))
    } catch (error) {
      console.error('Error deleting payment method:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert([{
          title: newMethod.title,
          price: newMethod.price,
          icon: selectedImage?.photo_url || null,
          is_active: newMethod.is_active
        }])
        .select()

      if (error) throw error

      setPaymentMethods([...(data || []), ...paymentMethods])
      setIsModalOpen(false)
      setNewMethod({
        title: '',
        price: 0,
        is_active: true
      })
      setSelectedImage(null)
    } catch (error) {
      console.error('Error adding payment method:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchPaymentMethods()
    fetchImages()
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Payment Methods</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all payment methods available in your store including their fees and status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Add Method
          </button>
        </div>
      </div>

      <Table
        data={paymentMethods}
        columns={columns}
        isLoading={loading}
        onSort={handleSort}
        showDelete={true}
        onDelete={handleDelete}
        actionColumnTitle="Actions"
      />

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setNewMethod({
            title: '',
            price: 0,
            is_active: true
          })
          setSelectedImage(null)
        }}
        title="Add Payment Method"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900">
              Method Name *
            </label>
            <input
              type="text"
              id="title"
              required
              className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              value={newMethod.title}
              onChange={(e) => setNewMethod(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-900">
              Fee
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="price"
                min="0"
                step="0.01"
                className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={newMethod.price}
                onChange={(e) => setNewMethod(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Icon *
            </label>
            <div className="mt-1 relative">
              <button
                type="button"
                onClick={() => setShowImageDropdown(!showImageDropdown)}
                className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <span className="flex items-center">
                  {selectedImage ? (
                    <>
                      <img src={selectedImage.photo_url} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                      <span className="ml-3 block truncate">
                        {selectedImage.title || 'Untitled'}
                      </span>
                    </>
                  ) : (
                    <span className="block truncate text-gray-500">Select an icon</span>
                  )}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </button>

              {showImageDropdown && createPortal(
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  onClick={() => setShowImageDropdown(false)}
                >
                  <div 
                    className="absolute top-0 left-0 right-0 bottom-0 bg-black/50" 
                    onClick={() => setShowImageDropdown(false)}
                  />
                  <div 
                    className="relative bg-white rounded-lg shadow-xl mx-4 my-auto"
                    style={{ maxWidth: '400px', maxHeight: 'calc(100vh - 100px)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Select an Icon</h3>
                    </div>
                    <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {images.map((image) => (
                          <div
                            key={image.id}
                            className={`cursor-pointer rounded-lg p-2 hover:bg-blue-50 ${
                              selectedImage?.id === image.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'border border-gray-200'
                            }`}
                            onClick={() => {
                              setSelectedImage(image)
                              setShowImageDropdown(false)
                            }}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <img src={image.photo_url} alt="" className="h-12 w-12 object-cover rounded" />
                              <p className="text-xs text-center truncate w-full">
                                {image.title || 'Untitled'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 flex justify-end">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setShowImageDropdown(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>, 
                document.body
              )}
            </div>
            {selectedImage && (
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="mt-1 text-sm text-red-600 hover:text-red-500"
              >
                Remove icon
              </button>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={newMethod.is_active}
              onChange={(e) => setNewMethod(prev => ({ ...prev, is_active: e.target.checked }))}
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !newMethod.title || !selectedImage}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed sm:col-start-2"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Adding...</span>
                </span>
              ) : (
                'Add Method'
              )}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
