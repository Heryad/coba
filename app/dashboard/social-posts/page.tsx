'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Table, { Column } from '../components/Table'
import Badge from '../components/Badge'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface SocialPost {
  id: string
  photo_url: string
  description: string | null
  user_id: string
  product_id: string
  is_active: boolean
  created_at: string
  users: {
    username: string
  }
  products: {
    product_name: string
  }
}

export default function SocialPostsPage() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClientComponentClient()

  const columns: Column<SocialPost>[] = [
    {
      key: 'photo_url',
      title: 'Photo',
      render: (value) => (
        <img
          src={value}
          alt=""
          className="h-16 w-16 rounded-lg object-cover"
        />
      ),
    },
    {
      key: 'users',
      title: 'Posted By',
      render: (value) => value?.username || 'Unknown',
    },
    {
      key: 'products',
      title: 'Product',
      render: (value) => value?.product_name || 'Unknown',
    },
    {
      key: 'description',
      title: 'Caption',
      render: (value) => (
        <div className="max-w-md">
          <p className="truncate">{value || 'No caption'}</p>
        </div>
      ),
    },
    {
      key: 'is_active',
      title: 'Status',
      render: (value) => (
        <Badge
          label={value ? 'Active' : 'Pending'}
          variant={value ? 'success' : 'warning'}
        />
      ),
    },
    {
      key: 'created_at',
      title: 'Posted At',
      type: 'date',
      sortable: true,
    },
  ]

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          users:users_table(username),
          products:products_table(product_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data)
    } catch (error) {
      console.error('Error fetching social posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = async (key: keyof SocialPost, direction: 'asc' | 'desc') => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          users:users_table(username),
          products:products_table(product_name)
        `)
        .order(key, { ascending: direction === 'asc' })

      if (error) throw error
      setPosts(data)
    } catch (error) {
      console.error('Error sorting social posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (post: SocialPost) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_active: true })
        .eq('id', post.id)

      if (error) throw error

      // Update local state
      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, is_active: true } : p
      ))
    } catch (error) {
      console.error('Error activating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const ActionButton = ({ item }: { item: SocialPost }) => {
    if (item.is_active) return null

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleActivate(item)
        }}
        className="inline-flex items-center gap-1 px-2 py-2 rounded-md bg-green-200 text-green-600 hover:bg-green-100 transition-colors duration-200"
        title="Activate Post"
        disabled={isSubmitting}
      >
        <CheckCircleIcon className="h-4 w-4" />
        <span className="text-xs font-medium">
          {isSubmitting ? 'Accepting...' : 'Accept'}
        </span>
      </button>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Social Posts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all community posts including photos, captions, and associated products.
          </p>
        </div>
      </div>

      <Table
        data={posts}
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
