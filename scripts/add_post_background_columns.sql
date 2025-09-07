-- Add background color and opacity columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS opacity INTEGER DEFAULT 100;

-- Update existing posts to have default values
UPDATE posts 
SET background_color = '#000000', opacity = 100 
WHERE background_color IS NULL OR opacity IS NULL;
