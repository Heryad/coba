export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users_table: {
        Row: {
          id: string
          username: string
          email_address: string
          phone_number: string | null
          photo_url: string | null
          total_orders: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users_table']['Row'], 'id' | 'created_at' | 'total_orders'>
        Update: Partial<Database['public']['Tables']['users_table']['Insert']>
      }
      categories_table: {
        Row: {
          id: string
          category_name: string
          sub_categories: string[]
          photo_url: string | null
          product_count: number
          subcategory_count: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories_table']['Row'], 'id' | 'created_at' | 'product_count' | 'subcategory_count'>
        Update: Partial<Database['public']['Tables']['categories_table']['Insert']>
      }
      products_table: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['products_table']['Row'], 'id' | 'created_at' | 'rating'>
        Update: Partial<Database['public']['Tables']['products_table']['Insert']>
      }
      ratings: {
        Row: {
          id: string
          description: string | null
          stars: number
          product_id: string
          user_id: string
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ratings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>
      }
      images: {
        Row: {
          id: string
          photo_url: string
          title: string | null
          placement: 'none' | 'cover' | 'icon' | 'offer'
          color_code: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['images']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['images']['Insert']>
      }
      orders: {
        Row: {
          id: string
          products: Json
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
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      payment_methods: {
        Row: {
          id: string
          title: string
          price: number
          icon: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payment_methods']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payment_methods']['Insert']>
      }
      admins: {
        Row: {
          id: string
          username: string
          password: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['admins']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['admins']['Insert']>
      }
      community_posts: {
        Row: {
          id: string
          photo_url: string
          description: string | null
          user_id: string
          product_id: string
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 