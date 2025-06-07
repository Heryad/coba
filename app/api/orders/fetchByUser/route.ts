import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*') // Select all columns as per table structure
      .eq('user_id', userId) // Filter by user_id
      .order('created_at', { ascending: false }); // Optional: Order by creation date

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {data: ratings, error: ratingsError} = await supabase
      .from('ratings')
      .select('*')
      .eq('user_id', userId);
    
    if (ratingsError) {
      console.error('Error fetching ratings:', ratingsError); 
    }

    return NextResponse.json({ orders, ratings });

  } catch (err) {
    console.error('Unexpected error fetching orders:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 