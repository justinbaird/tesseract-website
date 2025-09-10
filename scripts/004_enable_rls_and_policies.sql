-- Enable Row Level Security and create policies for all tables
-- This addresses the Supabase security warnings about RLS being disabled

-- Enable RLS on all tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to make script re-runnable)
DROP POLICY IF EXISTS "Posts are publicly readable" ON public.posts;
DROP POLICY IF EXISTS "Posts are editable by authenticated users" ON public.posts;

DROP POLICY IF EXISTS "Pages are publicly readable" ON public.pages;
DROP POLICY IF EXISTS "Pages are editable by authenticated users" ON public.pages;

DROP POLICY IF EXISTS "Content blocks are publicly readable" ON public.content_blocks;
DROP POLICY IF EXISTS "Content blocks are editable by authenticated users" ON public.content_blocks;

DROP POLICY IF EXISTS "Profile settings are publicly readable" ON public.profile_settings;
DROP POLICY IF EXISTS "Profile settings are editable by authenticated users" ON public.profile_settings;

-- Create policies for posts table
CREATE POLICY "Posts are publicly readable" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Posts are editable by authenticated users" ON public.posts
    FOR ALL USING (auth.role() = 'service_role');

-- Create policies for pages table
CREATE POLICY "Pages are publicly readable" ON public.pages
    FOR SELECT USING (true);

CREATE POLICY "Pages are editable by authenticated users" ON public.pages
    FOR ALL USING (auth.role() = 'service_role');

-- Create policies for content_blocks table
CREATE POLICY "Content blocks are publicly readable" ON public.content_blocks
    FOR SELECT USING (true);

CREATE POLICY "Content blocks are editable by authenticated users" ON public.content_blocks
    FOR ALL USING (auth.role() = 'service_role');

-- Create policies for profile_settings table
CREATE POLICY "Profile settings are publicly readable" ON public.profile_settings
    FOR SELECT USING (true);

CREATE POLICY "Profile settings are editable by authenticated users" ON public.profile_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions to anon role for public access
GRANT SELECT ON public.posts TO anon;
GRANT SELECT ON public.pages TO anon;
GRANT SELECT ON public.content_blocks TO anon;
GRANT SELECT ON public.profile_settings TO anon;

-- Grant full permissions to authenticated role (for admin operations)
GRANT ALL ON public.posts TO authenticated;
GRANT ALL ON public.pages TO authenticated;
GRANT ALL ON public.content_blocks TO authenticated;
GRANT ALL ON public.profile_settings TO authenticated;

-- Grant usage on sequences for insert operations
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
