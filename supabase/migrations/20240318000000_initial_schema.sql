-- Enable necessary extensions
create extension if not exists "uuid-ossp";

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
    id uuid primary key default uuid_generate_v4(),
    username text not null unique,
    password text not null,
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

-- Create indexes for better query performance
create index idx_products_category on public.products_table(category_id);
create index idx_ratings_product on public.ratings(product_id);
create index idx_orders_user on public.orders(user_id);
create index idx_community_posts_user on public.community_posts(user_id);
create index idx_community_posts_product on public.community_posts(product_id);

-- Set up Row Level Security (RLS)
alter table public.users_table enable row level security;
alter table public.categories_table enable row level security;
alter table public.products_table enable row level security;
alter table public.ratings enable row level security;
alter table public.images enable row level security;
alter table public.orders enable row level security;
alter table public.payment_methods enable row level security;
alter table public.admins enable row level security;
alter table public.community_posts enable row level security;

-- Create policies
-- Users can read all public data
create policy "Public users data is viewable by everyone" on public.users_table
    for select using (true);

create policy "Categories are viewable by everyone" on public.categories_table
    for select using (true);

create policy "Products are viewable by everyone" on public.products_table
    for select using (true);

create policy "Ratings are viewable by everyone" on public.ratings
    for select using (true);

create policy "Images are viewable by everyone" on public.images
    for select using (true);

create policy "Payment methods are viewable by everyone" on public.payment_methods
    for select using (true);

create policy "Community posts are viewable by everyone" on public.community_posts
    for select using (true);

-- Users can manage their own data
create policy "Users can manage their own data" on public.users_table
    for all using (auth.uid() = id);

create policy "Users can manage their own ratings" on public.ratings
    for all using (auth.uid() = user_id);

create policy "Users can manage their own orders" on public.orders
    for all using (auth.uid() = user_id);

create policy "Users can manage their own community posts" on public.community_posts
    for all using (auth.uid() = user_id);

-- Create storage bucket for public uploads
insert into storage.buckets (id, name, public) values ('public', 'public', true);

-- Allow public access to storage bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'public' );

create policy "Public Upload"
on storage.objects for insert
with check ( bucket_id = 'public' ); 