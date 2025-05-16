import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Fetch banners and offer images
    const { data: images, error: imagesError } = await supabase
      .from('images')
      .select('*')
      .in('placement', ['cover', 'offer'])
      .order('created_at', { ascending: false });

    if (imagesError) {
      console.error('Error fetching images:', imagesError);
      throw new Error('Error fetching images');
    }

    // Fetch categories and subcategories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories_table')
      .select('*')
      .eq('is_active', true)
      .order('category_name', { ascending: true });

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      throw new Error('Error fetching categories');
    }

    // Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products_table')
      .select(`
        *,
        categories_table(category_name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw new Error('Error fetching products');
    }

    // Transform products to match our frontend Product interface
    const transformedProducts = products.map(product => {
      return {
        id: product.id,
        name: product.product_name,
        description: product.product_desc || '',
        images: product.photos_url || [],
        price: Number(product.price),
        discount: Number(product.discount),
        final_price: Number(product.price) * (1 - Number(product.discount) / 100),
        review: Number(product.rating),
        category: product.categories_table?.category_name || '',
        subcategory: product.subcategory_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        total_orders: 0,
        created_at: product.created_at
      };
    });

    // Prepare the response data
    const responseData = {
      images: {
        banners: images.filter(img => img.placement === 'cover'),
        offers: images.filter(img => img.placement === 'offer'),
      },
      categories: categories,
      products: transformedProducts,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
} 