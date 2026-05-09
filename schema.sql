-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member'))
);

-- Seed initial users
INSERT INTO public.users (name, username, password, role)
VALUES 
    ('kb', 'kb', 'admin', 'admin'),
    ('Shivani', 'shivani', 'member', 'member'),
    ('Anamika', 'anamika', 'member', 'member')
ON CONFLICT (username) DO NOTHING;

-- Create sales table
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by TEXT NOT NULL REFERENCES public.users(username) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_phone TEXT,
    product TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL,
    payment_mode TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'refunded')),
    pending_percent NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime for sales table
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Seed initial target setting
INSERT INTO public.settings (key, value)
VALUES ('target_amount', '50000000')
ON CONFLICT (key) DO NOTHING;

-- Enable Realtime for settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
