-- Enable necessary extensions
create extension if not exists "uuid-ossp";

------------------------------------------
-- Create Tables
------------------------------------------

-- Create users table
create table public.users_table (
    id uuid primary key default uuid_generate_v4(),
    username text not null unique,
    email_address text not null unique,
    phone_number text,
    photo_url text,
    total_orders integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table
create table public.categories_table (
    id uuid primary key default uuid_generate_v4(),
    category_name text not null unique,
    sub_categories text[] default array[]::text[],
    photo_url text,
    product_count integer default 0,
    subcategory_count integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table public.products_table (
    id uuid primary key default uuid_generate_v4(),
    product_name text not null,
    product_desc text,
    colors text[] default array[]::text[],
    sizes text[] default array[]::text[],
    photos_url text[] default array[]::text[],
    category_id uuid references public.categories_table(id),
    subcategory_id text,
    rating numeric(3,2) default 0,
    price decimal(10,2) not null,
    discount decimal(5,2) default 0,
    is_stock boolean default true,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ratings table
create table public.ratings (
    id uuid primary key default uuid_generate_v4(),
    description text,
    stars integer check (stars >= 1 and stars <= 5),
    product_id uuid references public.products_table(id),
    user_id uuid references public.users_table(id),
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create images table
create table public.images (
    id uuid primary key default uuid_generate_v4(),
    photo_url text not null,
    title text,
    placement text check (placement in ('none', 'cover', 'icon', 'offer')),
    color_code text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create payment_methods table
create table public.payment_methods (
    id uuid primary key default uuid_generate_v4(),
    title text not null unique,
    price decimal(10,2) default 0,
    icon text,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table public.orders (
    id uuid primary key default uuid_generate_v4(),
    products jsonb not null, -- Array of product objects with quantity and details
    total decimal(10,2) not null,
    discount decimal(5,2) default 0,
    promo_code text,
    country text not null,
    city text not null,
    postcode text,
    address text not null,
    payment_method_id uuid references public.payment_methods(id),
    status text check (status in ('pending', 'accepted', 'processing', 'delivered')) default 'pending',
    user_id uuid references public.users_table(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create admins table
create table public.admins (
    id uuid primary key references auth.users(id),
    username text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create community_posts table
create table public.community_posts (
    id uuid primary key default uuid_generate_v4(),
    photo_url text not null,
    description text,
    user_id uuid references public.users_table(id),
    product_id uuid references public.products_table(id),
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

------------------------------------------
-- Create Functions and Triggers
------------------------------------------

-- Function to update category counts
CREATE OR REPLACE FUNCTION update_category_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update total product count for category
        UPDATE categories_table 
        SET product_count = product_count + 1
        WHERE id = NEW.category_id;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrease product count for category
        UPDATE categories_table 
        SET product_count = product_count - 1
        WHERE id = OLD.category_id;
        
    ELSIF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
        -- Decrease count for old category
        UPDATE categories_table 
        SET product_count = product_count - 1
        WHERE id = OLD.category_id;
        
        -- Increase count for new category
        UPDATE categories_table 
        SET product_count = product_count + 1
        WHERE id = NEW.category_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update subcategory count
CREATE OR REPLACE FUNCTION update_subcategory_count()
RETURNS TRIGGER AS $$
BEGIN
    NEW.subcategory_count = array_length(NEW.sub_categories, 1);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    -- Calculate new average rating for the affected product
    SELECT COALESCE(AVG(stars), 0)
    INTO avg_rating
    FROM ratings
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    AND is_active = true;

    -- Update the product's rating
    UPDATE products_table
    SET rating = avg_rating
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create Triggers
CREATE TRIGGER update_category_counts_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products_table
    FOR EACH ROW
    EXECUTE FUNCTION update_category_counts();

CREATE TRIGGER update_subcategory_count_trigger
    BEFORE INSERT OR UPDATE OF sub_categories ON categories_table
    FOR EACH ROW
    EXECUTE FUNCTION update_subcategory_count();

CREATE TRIGGER update_product_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

------------------------------------------
-- Create Indexes
------------------------------------------

create index idx_products_category on public.products_table(category_id);
create index idx_ratings_product on public.ratings(product_id);
create index idx_orders_user on public.orders(user_id);
create index idx_community_posts_user on public.community_posts(user_id);
create index idx_community_posts_product on public.community_posts(product_id);

------------------------------------------
-- Create Admin Authentication Function
------------------------------------------

-- Function to create first admin
create or replace function create_first_admin(admin_id uuid)
returns void as $$
begin
    if not exists (select 1 from public.admins) then
        insert into public.admins (id, username)
        select 
            admin_id,
            (select raw_user_meta_data->>'username' from auth.users where id = admin_id)
        from auth.users 
        where id = admin_id;
    end if;
end;
$$ language plpgsql security definer;

-- Function to check if user is admin
create or replace function is_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.admins 
        where id = auth.uid()
    );
end;
$$ language plpgsql security definer;

------------------------------------------
-- Set up Row Level Security (RLS)
------------------------------------------

-- Enable RLS on all tables
alter table public.users_table enable row level security;
alter table public.categories_table enable row level security;
alter table public.products_table enable row level security;
alter table public.ratings enable row level security;
alter table public.images enable row level security;
alter table public.orders enable row level security;
alter table public.payment_methods enable row level security;
alter table public.admins enable row level security;
alter table public.community_posts enable row level security;

-- Create policies for public access (read-only)
create policy "Public users data is viewable by everyone" 
    on public.users_table for select using (true);

create policy "Categories are viewable by everyone" 
    on public.categories_table for select using (true);

create policy "Products are viewable by everyone" 
    on public.products_table for select using (true);

create policy "Ratings are viewable by everyone" 
    on public.ratings for select using (true);

create policy "Images are viewable by everyone" 
    on public.images for select using (true);

create policy "Payment methods are viewable by everyone" 
    on public.payment_methods for select using (true);

create policy "Community posts are viewable by everyone" 
    on public.community_posts for select using (true);

-- Create policies for user data management
create policy "Users can manage their own data" 
    on public.users_table for all using (auth.uid() = id);

create policy "Users can manage their own ratings" 
    on public.ratings for all using (auth.uid() = user_id);

create policy "Users can manage their own orders" 
    on public.orders for all using (auth.uid() = user_id);

create policy "Users can manage their own community posts" 
    on public.community_posts for all using (auth.uid() = user_id);

-- Create admin policies (full access to all tables)
create policy "Admins have full access to users"
    on public.users_table
    for all
    using (is_admin())
    with check (is_admin());

create policy "Admins have full access to categories"
    on public.categories_table
    for all
    using (is_admin())
    with check (is_admin());

create policy "Admins have full access to products"
    on public.products_table
    for all
    using (is_admin())
    with check (is_admin());

create policy "Admins have full access to ratings"
    on public.ratings
    for all
    using (is_admin())
    with check (is_admin());

create policy "Admins have full access to images"
    on public.images
    for all
    using (is_admin())
    with check (is_admin());

create policy "Admins have full access to orders"
    on public.orders
    for all
    using (is_admin())
    with check (is_admin());

create policy "Admins have full access to payment methods"
    on public.payment_methods
    for all
    using (is_admin())
    with check (is_admin());

create policy "Admins have full access to community posts"
    on public.community_posts
    for all
    using (is_admin())
    with check (is_admin());

-- Admin table policies
create policy "Admin table is viewable by everyone" 
    on public.admins 
    for select 
    using (true);

create policy "Admins can insert other admins"
    on public.admins
    for insert
    with check (
        -- Allow insert if no admins exist (first admin)
        (NOT EXISTS (SELECT 1 FROM public.admins))
        OR 
        -- Or if the user is already an admin
        (is_admin())
    );

create policy "Admins can update admin accounts"
    on public.admins
    for update
    using (is_admin())
    with check (is_admin());

create policy "Admins can delete admin accounts"
    on public.admins
    for delete
    using (is_admin());

------------------------------------------
-- Set up Storage
------------------------------------------

-- Create storage bucket for public uploads
insert into storage.buckets (id, name, public) values ('public', 'public', true);

-- Storage policies
create policy "Public Access"
    on storage.objects for select
    using ( bucket_id = 'public' );

create policy "Public Upload"
    on storage.objects for insert
    with check ( bucket_id = 'public' );

-- Admin storage policies
create policy "Admins have full access to storage"
    on storage.objects
    for all
    using (is_admin())
    with check (is_admin()); 