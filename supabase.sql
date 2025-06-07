-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum type for order status
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'processing', 'delivered');

-- Create enum type for image placement
CREATE TYPE image_placement AS ENUM ('none', 'cover', 'icon', 'offer');

-- Create users table
CREATE TABLE users_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    photo_url TEXT,
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_email CHECK (email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create categories table
CREATE TABLE categories_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL,
    sub_categories TEXT[] NOT NULL,
    photo_url TEXT,
    product_count INTEGER DEFAULT 0,
    subcategory_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create products table
CREATE TABLE products_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    product_desc TEXT,
    colors TEXT[] NOT NULL,
    sizes TEXT[] NOT NULL,
    photos_url TEXT[] NOT NULL,
    category_id UUID NOT NULL REFERENCES categories_table(id),
    subcategory_id TEXT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    discount INTEGER DEFAULT 0,
    is_stock BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT valid_discount CHECK (discount >= 0 AND discount <= 100)
);

-- Create ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT,
    stars INTEGER NOT NULL,
    product_id UUID NOT NULL REFERENCES products_table(id),
    user_id UUID NOT NULL REFERENCES users_table(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_stars CHECK (stars >= 1 AND stars <= 5)
);

-- Create images table
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_url TEXT NOT NULL,
    title VARCHAR(255),
    placement image_placement DEFAULT 'none',
    color_code VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_color_code CHECK (color_code ~* '^#[0-9A-F]{6}$')
);

-- Create payment methods table
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    products JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    promo_code VARCHAR(50),
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postcode VARCHAR(20),
    address TEXT NOT NULL,
    payment_method_id UUID NOT NULL REFERENCES payment_methods(id),
    status order_status DEFAULT 'pending',
    user_id UUID NOT NULL REFERENCES users_table(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create community posts table
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_url TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES users_table(id),
    product_id UUID NOT NULL REFERENCES products_table(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products_table(category_id);
CREATE INDEX idx_ratings_product ON ratings(product_id);
CREATE INDEX idx_ratings_user ON ratings(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_community_posts_user ON community_posts(user_id);
CREATE INDEX idx_community_posts_product ON community_posts(product_id);

-- Create RLS policies for public access to products
ALTER TABLE products_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products are viewable by everyone" ON products_table
    FOR SELECT USING (is_active = true);

-- Storage bucket policies
-- Create single public bucket that's accessible to everyone
INSERT INTO storage.buckets (id, name, public) VALUES ('public', 'public', true);

-- Allow public access to the bucket for all operations
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'public' );

CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'public' );

CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'public' );

CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'public' );

-- Create triggers for maintaining counts
CREATE OR REPLACE FUNCTION update_product_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories_table
        SET product_count = product_count + 1
        WHERE id = NEW.category_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories_table
        SET product_count = product_count - 1
        WHERE id = OLD.category_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_count_trigger
AFTER INSERT OR DELETE ON products_table
FOR EACH ROW
EXECUTE FUNCTION update_product_count();

-- Create trigger for updating user total orders
CREATE OR REPLACE FUNCTION update_user_total_orders()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users_table
        SET total_orders = total_orders + 1
        WHERE id = NEW.user_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_total_orders_trigger
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION update_user_total_orders();

-- Create trigger for updating product ratings
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the product's rating with the new average
    UPDATE products_table
    SET rating = (
        SELECT COALESCE(ROUND(AVG(stars)::numeric, 2), 0)
        FROM ratings
        WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        AND is_active = true
    )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for ratings table
CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_product_rating(); 