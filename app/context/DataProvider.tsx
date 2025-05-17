'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types definitions matching the actual API response structure
export type Image = {
  id: string
  photo_url: string
  placement: string
  title: string
  created_at: string
}

export type Category = {
  id: string
  category_name: string
  sub_categories: string[]
  photo_url: string
  product_count: number
  subcategory_count: number
  is_active: boolean
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string
  images: string[]
  price: number
  discount: number
  final_price: number
  review: number
  category: string
  subcategory: string
  colors: string[]
  sizes: string[]
  total_orders: number
  created_at: string
}

export type PaymentMethod = {
  id: string
  title: string
  price: number
  icon: string
  is_active: boolean
  created_at: string
}

export type ApiData = {
  images: {
    banners: Image[]
    offers: Image[]
  }
  categories: Category[]
  products: Product[]
  paymentMethods: PaymentMethod[]
}

// Default initial state
const initialData: ApiData = {
  images: {
    banners: [],
    offers: []
  },
  categories: [],
  products: [],
  paymentMethods: []
}

// Create context
type DataContextType = {
  data: ApiData
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Provider component
type DataProviderProps = {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  const [data, setData] = useState<ApiData>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/data')
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      
      const apiData: ApiData = await response.json()
      setData(apiData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      console.error('Error fetching data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const value = {
    data,
    isLoading,
    error,
    refetch: fetchData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
} 