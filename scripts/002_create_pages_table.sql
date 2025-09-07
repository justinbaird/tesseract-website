-- Create pages table for storing page configurations
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  is_homepage BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_blocks table for storing page content
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  block_type VARCHAR(50) NOT NULL, -- 'hero', 'text', 'image', 'gallery', 'contact', etc.
  content JSONB NOT NULL, -- Flexible content storage
  position INTEGER NOT NULL, -- Order of blocks on page
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_content_blocks_page_id ON content_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_position ON content_blocks(page_id, position);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(is_published);
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_sort_order ON pages(sort_order);

-- Add constraint to prevent circular references (a page cannot be its own parent)
ALTER TABLE pages ADD CONSTRAINT IF NOT EXISTS check_no_self_reference CHECK (id != parent_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_pages_updated_at 
    BEFORE UPDATE ON pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at 
    BEFORE UPDATE ON content_blocks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
