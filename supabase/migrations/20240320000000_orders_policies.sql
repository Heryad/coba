-- Drop existing policies if any
drop policy if exists "Orders are viewable by everyone" on public.orders;
drop policy if exists "Users can manage their own orders" on public.orders;
drop policy if exists "Admins have full access to orders" on public.orders;
drop policy if exists "Public can create orders" on public.orders;

-- Create new policies for orders table

-- Allow public to create orders (for guest checkout)
create policy "Public can create orders"
    on public.orders
    for insert
    with check (
        -- Allow any insert operation
        true
    );

-- Allow public to view orders by ID (for order tracking)
create policy "Public can view orders by ID"
    on public.orders
    for select
    using (
        -- Allow viewing any order
        true
    );

-- Allow users to update their own orders (for status updates, etc.)
create policy "Users can update their own orders"
    on public.orders
    for update
    using (
        auth.uid() = user_id
        or
        -- Allow updating orders with null user_id (guest orders)
        user_id is null
    );

-- Allow users to delete their own orders (for cancellation)
create policy "Users can delete their own orders"
    on public.orders
    for delete
    using (
        auth.uid() = user_id
        or
        -- Allow deleting orders with null user_id (guest orders)
        user_id is null
    );

-- Admins have full access to all orders
create policy "Admins have full access to orders"
    on public.orders
    for all
    using (is_admin())
    with check (is_admin());

-- Add RLS to orders table if not already enabled
alter table public.orders enable row level security; 