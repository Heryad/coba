'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createPortal } from 'react-dom'
import Table, { Column } from '@/app/dashboard/components/Table'
import Modal from '@/app/dashboard/components/Modal'
import Badge from '@/app/dashboard/components/Badge'
import LoadingSpinner from '@/app/dashboard/components/LoadingSpinner'
import type { Database } from '@/types/supabase'
import { PlusIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'

type Category = Database['public']['Tables']['categories_table']['Row']
type Image = Database['public']['Tables']['images']['Row']

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showImageDropdown, setShowImageDropdown] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [formData, setFormData] = useState({
    category_name: '',
    sub_categories: [] as string[],
    is_active: true
  })
  const [newSubCategory, setNewSubCategory] = useState('')
  const supabase = createClientComponentClient<Database>()

  const columns: Column<Category>[] = [
    { 
      key: 'category_name',
      title: 'Name',
      type: 'text' as const
    },
    {
      key: 'sub_categories',
      title: 'Sub Categories',
      type: 'text' as const,
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.map((sub, index) => (
            <Badge
              key={index}
              label={sub}
              variant="info"
            />
          ))}
        </div>
      ),
    },
    {
      key: 'product_count',
      title: 'Products',
      type: 'number' as const,
      render: (value: number) => (
        <Badge
          label={String(value)}
          variant="success"
        />
      ),
    },
    {
      key: 'is_active',
      title: 'Status',
      type: 'text' as const,
      render: (value: boolean) => (
        <Badge
          label={value ? 'Active' : 'Inactive'}
          variant={value ? 'success' : 'default'}
        />
      ),
    },
    { 
      key: 'created_at',
      title: 'Created At',
      type: 'date' as const
    },
  ]

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

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('categories_table')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      // Save to database
      const { error: dbError } = await supabase.from('categories_table').insert({
        category_name: formData.category_name,
        sub_categories: formData.sub_categories,
        photo_url: selectedImage?.photo_url || null,
        is_active: formData.is_active,
      })

      if (dbError) throw dbError

      await fetchCategories()
      setIsModalOpen(false)
      // Reset form
      setSelectedImage(null)
      setFormData({
        category_name: '',
        sub_categories: [],
        is_active: true
      })
      setNewSubCategory('')
    } catch (error) {
      console.error('Error creating category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (newSubCategory.trim()) {
        setFormData(prev => ({
          ...prev,
          sub_categories: [...prev.sub_categories, newSubCategory.trim().replace(' ', '-')]
        }))
        setNewSubCategory('')
      }
    }
  }

  const handleDelete = async (category: Category) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('categories_table')
        .delete()
        .eq('id', category.id);

      if (dbError) throw dbError;

      // If there's a photo, delete it from storage
      if (category.photo_url) {
        const filename = category.photo_url.split('/').pop();
        if (filename) {
          await supabase.storage
            .from('public')
            .remove([`categories/${filename}`]);
        }
      }

      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const removeSubCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sub_categories: prev.sub_categories.filter((_, i) => i !== index)
    }))
  }

  // Fetch data on mount
  useEffect(() => {
    fetchCategories()
    fetchImages()
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all product categories in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Add Category
          </button>
        </div>
      </div>

      <Table
        data={categories}
        columns={columns}
        isLoading={isLoading}
        showDelete={true}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedImage(null)
          setFormData({
            category_name: '',
            sub_categories: [],
            is_active: true
          })
          setNewSubCategory('')
        }}
        title="Add New Category"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category_name" className="block text-sm font-medium leading-6 text-gray-900">
              Category Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={(e) => setFormData(prev => ({ ...prev, category_name: e.target.value }))}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Sub Categories
            </label>
            <div className="mt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  onKeyDown={handleSubCategoryKeyDown}
                  className="block flex-1 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter sub category and press Enter"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSubCategory.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        sub_categories: [...prev.sub_categories, newSubCategory.trim()]
                      }))
                      setNewSubCategory('')
                    }
                  }}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.sub_categories.map((sub, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-600"
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => removeSubCategory(index)}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      <span className="sr-only">Remove</span>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Category Image
            </label>
            <div className="mt-1 relative">
              <button
                type="button"
                onClick={() => setShowImageDropdown(!showImageDropdown)}
                className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                    <span className="block truncate text-gray-500">Select an image</span>
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
                      <h3 className="text-lg font-medium text-gray-900">Select an Image</h3>
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
                Remove image
              </button>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active Category
            </label>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Creating...</span>
                </span>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
