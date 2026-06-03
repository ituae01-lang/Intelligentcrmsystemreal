-- Intelligent CRM System - Supabase Database Schema
-- For Nigerian SMEs - Southern Delta University Project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('Owner', 'Staff')) NOT NULL DEFAULT 'Staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  category TEXT CHECK (category IN ('Frequent', 'Occasional', 'New')) NOT NULL DEFAULT 'New',
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_spent NUMERIC(10, 2) DEFAULT 0,
  last_purchase DATE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('Sale', 'Inquiry', 'Complaint', 'Call', 'Visit', 'Follow-up')) NOT NULL,
  note TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_category ON customers(category);
CREATE INDEX IF NOT EXISTS idx_customers_last_purchase ON customers(last_purchase);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(date);
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_customer_id ON interactions(customer_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Customers policies
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Purchases policies
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchases"
  ON purchases FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own purchases"
  ON purchases FOR DELETE
  USING (auth.uid() = user_id);

-- Interactions policies
CREATE POLICY "Users can view own interactions"
  ON interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions"
  ON interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions"
  ON interactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions"
  ON interactions FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update customer total_spent and last_purchase
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE customers
    SET
      total_spent = (
        SELECT COALESCE(SUM(amount), 0)
        FROM purchases
        WHERE customer_id = NEW.customer_id
      ),
      last_purchase = (
        SELECT MAX(date)
        FROM purchases
        WHERE customer_id = NEW.customer_id
      )
    WHERE id = NEW.customer_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update customer stats
CREATE TRIGGER update_customer_stats_trigger
AFTER INSERT OR UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_customer_stats();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Sample data insertion (optional - for testing)
-- Run this after creating your first user account

/*
-- Insert sample products (replace USER_ID with actual auth.uid())
INSERT INTO products (user_id, name, category, price, stock) VALUES
  ('USER_ID', 'Samsung Phone Charger', 'Accessories', 3500, 45),
  ('USER_ID', 'iPhone Cable (Lightning)', 'Accessories', 4200, 38),
  ('USER_ID', 'Power Bank 10000mAh', 'Accessories', 8500, 22),
  ('USER_ID', 'Bluetooth Earphones', 'Audio', 12000, 18),
  ('USER_ID', 'Phone Screen Protector', 'Accessories', 1500, 67);

-- Insert sample customers (replace USER_ID)
INSERT INTO customers (user_id, name, email, phone, category, join_date, total_spent, last_purchase, location) VALUES
  ('USER_ID', 'Chinedu Okafor', 'chinedu.okafor@email.com', '+234 803 456 7890', 'Frequent', '2025-01-15', 145000, '2026-05-28', 'Ozoro, Delta State'),
  ('USER_ID', 'Amina Bello', 'amina.bello@email.com', '+234 805 123 4567', 'Frequent', '2025-02-10', 89000, '2026-05-30', 'Agbor, Delta State');
*/

-- Verify schema
SELECT 'Schema created successfully!' as message;
