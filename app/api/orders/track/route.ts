import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                *,
                payment_methods (
                    title,
                    icon
                )
            `)
            .eq('id', orderId)
            .single();

        if (error) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 