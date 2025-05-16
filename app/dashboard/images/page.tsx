'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Table, { Column } from '@/app/dashboard/components/Table'
import Modal from '@/app/dashboard/components/Modal'
import Badge from '@/app/dashboard/components/Badge'
import LoadingSpinner from '@/app/dashboard/components/LoadingSpinner'
import type { Database } from '@/types/supabase'
import { PlusIcon } from '@heroicons/react/24/outline'

type Image = Database['public']['Tables']['images']['Row']
type ImagePlacement = Image['placement']

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageTitle, setImageTitle] = useState('')
  const [placement, setPlacement] = useState<ImagePlacement>('none')
  const supabase = createClientComponentClient<Database>()

  const placements: { value: ImagePlacement; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'cover', label: 'Cover' },
    { value: 'icon', label: 'Icon' },
    { value: 'offer', label: 'Offer' },
  ]

  const columns: Column<Image>[] = [
    { 
      key: 'id',
      title: 'ID',
      type: 'text' as const
    },
    { 
      key: 'title',
      title: 'Title',
      type: 'text' as const
    },
    {
      key: 'placement',
      title: 'Placement',
      type: 'text' as const,
      render: (value: Image['placement']) => (
        <Badge
          label={value}
          variant={
            value === 'cover'
              ? 'success'
              : value === 'icon'
              ? 'info'
              : value === 'offer'
              ? 'warning'
              : 'default'
          }
        />
      ),
    },
    {
      key: 'photo_url',
      title: 'Preview',
      type: 'text' as const,
      render: (value: string) => (
        <img src={value} alt="Preview" className="h-10 w-10 rounded-full object-cover" />
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
      setIsLoading(true)
      const { data, error } = await supabase.from('images').select('*').order('created_at', { ascending: false })
      
      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!imageTitle) {
        setImageTitle(file.name)
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    try {
      setIsUploading(true)

      // Upload to Storage
      const fileExt = selectedFile.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`
      
      const { error: uploadError, data } = await supabase.storage
        .from('public')
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath)

      // Save to database
      const { error: dbError } = await supabase.from('images').insert({
        photo_url: publicUrl,
        title: imageTitle,
        placement,
      })

      if (dbError) throw dbError

      await fetchImages()
      setIsModalOpen(false)
      // Reset form
      setSelectedFile(null)
      setImageTitle('')
      setPlacement('none')
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (image: Image) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // First delete from storage
      const filename = image.photo_url.split('/').pop();
      if (filename) {
        const { error: storageError } = await supabase.storage
          .from('public')
          .remove([filename]);

        if (storageError) throw storageError;
      }

      // Then delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      // Refresh the images list
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Fetch images on mount
  useEffect(() => {
    fetchImages()
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Images</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all images uploaded to the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Upload Image
          </button>
        </div>
      </div>

      <Table
        data={images}
        columns={columns}
        isLoading={isLoading}
        showDelete={true}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedFile(null)
          setImageTitle('')
          setPlacement('none')
        }}
        title="Upload New Image"
      >
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
              Title
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="title"
                name="title"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="placement" className="block text-sm font-medium leading-6 text-gray-900">
              Placement
            </label>
            <div className="mt-2">
              <select
                id="placement"
                name="placement"
                value={placement}
                onChange={(e) => setPlacement(e.target.value as ImagePlacement)}
                className="block w-full rounded-md border-0 py-2.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {placements.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Image
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                {selectedFile ? (
                  <div className="text-sm text-gray-900">
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full h-6 w-6 bg-red-100 hover:bg-red-200 transition-colors"
                      >
                        <span className="sr-only">Remove image</span>
                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">{selectedFile.name}</p>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileSelect}
                          required={!selectedFile}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Uploading...</span>
                </span>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}