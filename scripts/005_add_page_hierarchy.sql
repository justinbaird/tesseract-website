-- Add parent_id column to pages table for hierarchical navigation
-- This allows pages to be nested under other pages

ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES pages(id) ON DELETE SET NULL;

-- Add index for better performance when querying hierarchical data
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);

-- Add constraint to prevent circular references (a page cannot be its own parent)
-- First check if constraint already exists, then add if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_no_self_reference' 
        AND table_name = 'pages'
    ) THEN
        ALTER TABLE pages ADD CONSTRAINT check_no_self_reference CHECK (id != parent_id);
    END IF;
END $$;

-- Update any existing pages to ensure they have proper sort_order if missing
UPDATE pages 
SET sort_order = 0 
WHERE sort_order IS NULL;

-- Comments for clarity
COMMENT ON COLUMN pages.parent_id IS 'References parent page ID for hierarchical navigation structure';
COMMENT ON INDEX idx_pages_parent_id IS 'Index for efficient parent-child page queries';
