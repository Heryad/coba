'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Table, { Column } from '../components/Table'
import Badge from '../components/Badge'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface Review {
  id: string
  description: string
  stars: number
  product_id: string
  user_id: string
  is_active: boolean
  created_at: string
  products: {
    product_name: string
  }
  users: {
    username: string
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient()

  const columns: Column<Review>[] = [
    {
      key: 'users',
      title: 'User',
      render: (value) => value?.username || 'Unknown',
    },
    {
      key: 'products',
      title: 'Product',
      render: (value) => value?.product_name || 'Unknown',
    },
    {
      key: 'stars',
      title: 'Rating',
      sortable: true,
      render: (value) => '⭐'.repeat(value),
    },
    {
      key: 'description',
      title: 'Review',
      render: (value) => (
        <div className="max-w-md">
          <p className="truncate">{value}</p>
        </div>
      ),
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
      title: 'Date',
      type: 'date',
      sortable: true,
    },
  ]

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          products:products_table(product_name),
          users:users_table(username)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = async (key: keyof Review, direction: 'asc' | 'desc') => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          products:products_table(product_name),
          users:users_table(username)
        `)
        .order(key, { ascending: direction === 'asc' })

      if (error) throw error
      setReviews(data)
    } catch (error) {
      console.error('Error sorting reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (review: Review) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('ratings')
        .update({ is_active: true })
        .eq('id', review.id)

      if (error) throw error

      // Update local state
      setReviews(reviews.map(r => 
        r.id === review.id ? { ...r, is_active: true } : r
      ))
    } catch (error) {
      console.error('Error activating review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const ActionButton = ({ item }: { item: Review }) => {
    if (item.is_active) return null

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleActivate(item)
        }}
        className="inline-flex items-center gap-1 px-2 py-2 rounded-md bg-green-200 text-green-600 hover:bg-green-100 transition-colors duration-200"
        title="Activate Review"
        disabled={isSubmitting}
      >
        <CheckCircleIcon className="h-4 w-4" />
        <span className="text-xs font-medium">{isSubmitting ? 'Accepting...' : 'Accept'}</span>
      </button>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all product reviews including the reviewer, product, rating, and status.
          </p>
        </div>
      </div>

      <Table
        data={reviews}
        columns={columns}
        isLoading={loading}
        onSort={handleSort}
        showDelete={false}
        actionButton={ActionButton}
        actionColumnTitle="Moderation"
      />
    </div>
  )
}
