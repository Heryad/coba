import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            products,
            total,
            discount,
            promoCode,
            country,
            city,
            postcode,
            address,
            paymentMethodId,
            user_id
        } = body;

        // Validate required fields
        if (!products || !total || !country || !city || !address || !paymentMethodId) {
            return NextResponse.json(
                { error: 'Missing required fields', body },
                { status: 400 }
            );
        }

        // Create order in Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    products,
                    total,
                    discount: discount || 0,
                    promo_code: promoCode,
                    country,
                    city,
                    postcode,
                    address,
                    payment_method_id: paymentMethodId,
                    status: 'pending',
                    user_id: user_id
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating order:', error);
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in order creation:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 