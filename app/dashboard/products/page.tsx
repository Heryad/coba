'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createPortal } from 'react-dom'
import Table, { Column } from '../components/Table'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import LoadingSpinner from '../components/LoadingSpinner'
import { PlusIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  product_name: string
  product_desc: string | null
  colors: string[]
  sizes: string[]
  photos_url: string[]
  category_id: string
  subcategory_id: string | null
  rating: number
  price: number
  discount: number
  is_stock: boolean
  is_active: boolean
  created_at: string
}

interface Category {
  id: string
  category_name: string
  sub_categories: string[]
}

interface Image {
  id: string
  photo_url: string
  title: string | null
  placement: string | null
  color_code: string | null
  created_at: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false)
  const [showImageDropdown, setShowImageDropdown] = useState(false)
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    product_desc: '',
    colors: [''],
    sizes: [''],
    photos_url: [] as string[],
    category_id: '',
    subcategory_id: '',
    price: 0,
    discount: 0,
    is_stock: true,
    is_active: true
  })
  const supabase = createClientComponentClient()

  const columns: Column<Product>[] = [
    {
      key: 'photos_url',
      title: 'Image',
      render: (value: string[]) => (
        <img
          src={value[0]}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
        />
      ),
    },
    {
      key: 'product_name',
      title: 'Product Name',
      sortable: true,
    },
    {
      key: 'category_id',
      title: 'Category',
      render: (value: string, item: Product) => {
        const category = categories.find(c => c.id === value)
        return (
          <div className="flex flex-col gap-1">
            <Badge
              label={category?.category_name || 'Unknown'}
              variant="info"
            />
            {item.subcategory_id && (
              <Badge
                label={item.subcategory_id}
                variant="default"
              />
            )}
          </div>
        )
      },
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: 'rating',
      title: 'Rating',
      sortable: true,
      render: (value) => `${value.toFixed(1)} ⭐`,
    },
    {
      key: 'is_stock',
      title: 'Stock Status',
      render: (value) => (
        <Badge
          label={value ? 'In Stock' : 'Out of Stock'}
          variant={value ? 'success' : 'error'}
        />
      ),
    },
    {
      key: 'created_at',
      title: 'Created At',
      type: 'date',
      sortable: true,
    },
  ]

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products_table')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories_table')
        .select('id, category_name, sub_categories')

      if (error) throw error
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
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

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchImages()
  }, [])

  const handleSort = async (key: keyof Product, direction: 'asc' | 'desc') => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products_table')
        .select('*')
        .order(key, { ascending: direction === 'asc' })

      if (error) throw error
      setProducts(data)
    } catch (error) {
      console.error('Error sorting products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      // Filter out empty values from arrays
      const filteredProduct = {
        ...newProduct,
        colors: newProduct.colors.filter(color => color.trim() !== ''),
        sizes: newProduct.sizes.filter(size => size.trim() !== ''),
        photos_url: selectedImages.map(img => img.photo_url)
      }

      const { data, error } = await supabase
        .from('products_table')
        .insert([filteredProduct])
        .select()

      if (error) throw error

      setProducts([...(data || []), ...products])
      setIsNewProductModalOpen(false)
      setSelectedImages([])
      setNewProduct({
        product_name: '',
        product_desc: '',
        colors: [''],
        sizes: [''],
        photos_url: [],
        category_id: '',
        subcategory_id: '',
        price: 0,
        discount: 0,
        is_stock: true,
        is_active: true
      })
    } catch (error) {
      console.error('Error adding product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArrayInputChange = (
    field: 'colors' | 'sizes',
    value: string
  ) => {
    if (value.trim() === '') return

    setNewProduct(prev => {
      const newArray = [...prev[field].slice(0, -1), value.trim(), '']
      return { ...prev, [field]: newArray }
    })
  }

  const removeArrayItem = (field: 'colors' | 'sizes', index: number) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return
    
    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('products_table')
        .delete()
        .eq('id', selectedProduct.id)

      if (error) throw error

      setProducts(products.filter(p => p.id !== selectedProduct.id))
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all products in your store including their name, price, rating, and stock status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsNewProductModalOpen(true)}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Add Product
          </button>
        </div>
      </div>

      <Table
        data={products}
        columns={columns}
        isLoading={loading}
        onSort={handleSort}
        onRowClick={handleRowClick}
      />

      {/* View Product Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.product_name}
        >
          <div className="space-y-4">
            <div className="relative w-full h-[400px]">
              <img
                src={selectedProduct.photos_url[currentImageIndex]}
                alt={`${selectedProduct.product_name} - Image ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-contain rounded-lg bg-gray-100"
              />
              {selectedProduct.photos_url.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {selectedProduct.photos_url.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              {selectedProduct.photos_url.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev === 0 ? selectedProduct.photos_url.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev === selectedProduct.photos_url.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600">{selectedProduct.product_desc || 'No description available'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Price</h3>
                <p className="text-gray-600">
                  ${selectedProduct.price.toFixed(2)}
                  {selectedProduct.discount > 0 && (
                    <span className="ml-2 text-green-600">
                      ({selectedProduct.discount}% off)
                    </span>
                  )}
                </p>
              </div>
              {selectedProduct.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900">Available Colors</h3>
                  <div className="flex gap-2 mt-1">
                    {selectedProduct.colors.map((color) => (
                      <span
                        key={color}
                        className="px-2 py-1 text-xs rounded bg-gray-100"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProduct.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900">Available Sizes</h3>
                  <div className="flex gap-2 mt-1">
                    {selectedProduct.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-2 py-1 text-xs rounded bg-gray-100"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                    handleDeleteProduct()
                  }
                }}
                disabled={isSubmitting}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isNewProductModalOpen}
        onClose={() => {
          setIsNewProductModalOpen(false)
          setSelectedImages([])
          setNewProduct({
            product_name: '',
            product_desc: '',
            colors: [''],
            sizes: [''],
            photos_url: [],
            category_id: '',
            subcategory_id: '',
            price: 0,
            discount: 0,
            is_stock: true,
            is_active: true
          })
        }}
        title="Add New Product"
      >
        <form onSubmit={handleAddProduct} className="space-y-6">
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium text-gray-900">
              Product Name *
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="product_name"
                required
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={newProduct.product_name}
                onChange={(e) => setNewProduct(prev => ({ ...prev, product_name: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="product_desc" className="block text-sm font-medium text-gray-900">
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="product_desc"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={newProduct.product_desc}
                onChange={(e) => setNewProduct(prev => ({ ...prev, product_desc: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-900">
              Category *
            </label>
            <div className="mt-2">
              <select
                id="category"
                required
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={newProduct.category_id}
                onChange={(e) => {
                  const category = categories.find(c => c.id === e.target.value)
                  setNewProduct(prev => ({
                    ...prev,
                    category_id: e.target.value,
                    subcategory_id: ''
                  }))
                }}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {newProduct.category_id && (
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-900">
                Subcategory
              </label>
              <div className="mt-2">
                <select
                  id="subcategory"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={newProduct.subcategory_id}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, subcategory_id: e.target.value }))}
                >
                  <option value="">Select a subcategory</option>
                  {categories
                    .find(c => c.id === newProduct.category_id)
                    ?.sub_categories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900">Colors</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {newProduct.colors.filter(color => color.trim() !== '').map((color, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('colors', index)}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    <span className="sr-only">Remove</span>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Enter a color and press Enter"
                value={newProduct.colors[newProduct.colors.length - 1]}
                onChange={(e) => {
                  const newColors = [...newProduct.colors]
                  newColors[newColors.length - 1] = e.target.value
                  setNewProduct(prev => ({ ...prev, colors: newColors }))
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const value = e.currentTarget.value.trim()
                    if (value) {
                      handleArrayInputChange('colors', value)
                      e.currentTarget.value = ''
                    }
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Sizes</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {newProduct.sizes.filter(size => size.trim() !== '').map((size, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('sizes', index)}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    <span className="sr-only">Remove</span>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Enter a size and press Enter"
                value={newProduct.sizes[newProduct.sizes.length - 1]}
                onChange={(e) => {
                  const newSizes = [...newProduct.sizes]
                  newSizes[newSizes.length - 1] = e.target.value
                  setNewProduct(prev => ({ ...prev, sizes: newSizes }))
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const value = e.currentTarget.value.trim()
                    if (value) {
                      handleArrayInputChange('sizes', value)
                      e.currentTarget.value = ''
                    }
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Product Images *
            </label>
            <div className="mt-2 relative">
              <button
                type="button"
                onClick={() => setShowImageDropdown(!showImageDropdown)}
                className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <span className="block truncate text-gray-500">
                  {selectedImages.length > 0 
                    ? `${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} selected`
                    : 'Select images'
                  }
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
                    style={{ maxWidth: '600px', maxHeight: 'calc(100vh - 100px)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Select Product Images</h3>
                      <p className="mt-1 text-sm text-gray-500">Click on images to select multiple</p>
                    </div>
                    <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {images.map((image) => (
                          <div
                            key={image.id}
                            className={`cursor-pointer rounded-lg p-2 hover:bg-blue-50 ${
                              selectedImages.some(img => img.id === image.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'border border-gray-200'
                            }`}
                            onClick={() => {
                              setSelectedImages(prev => {
                                const isSelected = prev.some(img => img.id === image.id)
                                if (isSelected) {
                                  return prev.filter(img => img.id !== image.id)
                                } else {
                                  return [...prev, image]
                                }
                              })
                            }}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <img src={image.photo_url} alt="" className="h-16 w-16 object-cover rounded" />
                              <p className="text-xs text-center truncate w-full">
                                {image.title || 'Untitled'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setShowImageDropdown(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        onClick={() => setShowImageDropdown(false)}
                      >
                        Done ({selectedImages.length})
                      </button>
                    </div>
                  </div>
                </div>, 
                document.body
              )}
            </div>
            {selectedImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedImages.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.photo_url}
                      alt=""
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(index)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="sr-only">Remove</span>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-900">
                Price *
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="price"
                  required
                  min="0"
                  step="0.01"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-900">
                Discount (%)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="discount"
                  min="0"
                  max="100"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={newProduct.discount}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, discount: parseFloat(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={newProduct.is_stock}
                onChange={(e) => setNewProduct(prev => ({ ...prev, is_stock: e.target.checked }))}
              />
              <span className="ml-2 text-sm text-gray-700">In Stock</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={newProduct.is_active}
                onChange={(e) => setNewProduct(prev => ({ ...prev, is_active: e.target.checked }))}
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              disabled={isSubmitting || selectedImages.length === 0}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed sm:col-start-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Creating...</span>
                </span>
              ) : (
                'Add Product'
              )}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              onClick={() => setIsNewProductModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
