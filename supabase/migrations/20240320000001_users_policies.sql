-- Drop existing policies if any
drop policy if exists "Public users data is viewable by everyone" on public.users_table;
drop policy if exists "Users can manage their own data" on public.users_table;
drop policy if exists "Admins have full access to users" on public.users_table;

-- Create new policies for users table

-- Allow public to create user profiles (for registration)
create policy "Public can create user profiles"
    on public.users_table
    for insert
    with check (
        -- Allow any insert operation
        true
    );

-- Allow public to view user profiles (for public profile viewing)
create policy "Public can view user profiles"
    on public.users_table
    for select
    using (
        -- Allow viewing any user profile
        true
    );

-- Allow users to update their own profiles
create policy "Users can update their own profiles"
    on public.users_table
    for update
    using (
        auth.uid() = id
    )
    with check (
        auth.uid() = id
    );

-- Allow users to delete their own profiles
create policy "Users can delete their own profiles"
    on public.users_table
    for delete
    using (
        auth.uid() = id
    );

-- Admins have full access to all user profiles
create policy "Admins have full access to users"
    on public.users_table
    for all
    using (is_admin())
    with check (is_admin());

-- Add RLS to users table if not already enabled
alter table public.users_table enable row level security; 