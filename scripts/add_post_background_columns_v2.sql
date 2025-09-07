-- Add background_color and opacity columns to posts table
-- This script safely adds the columns if they don't exist

DO $$ 
BEGIN
    -- Add background_color column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'background_color'
    ) THEN
        ALTER TABLE posts ADD COLUMN background_color TEXT DEFAULT '#000000';
        RAISE NOTICE 'Added background_color column to posts table';
    ELSE
        RAISE NOTICE 'background_color column already exists in posts table';
    END IF;

    -- Add opacity column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'opacity'
    ) THEN
        ALTER TABLE posts ADD COLUMN opacity INTEGER DEFAULT 100;
        RAISE NOTICE 'Added opacity column to posts table';
    ELSE
        RAISE NOTICE 'opacity column already exists in posts table';
    END IF;

    -- Update existing posts to have default background styling
    UPDATE posts 
    SET 
        background_color = COALESCE(background_color, '#000000'),
        opacity = COALESCE(opacity, 100)
    WHERE background_color IS NULL OR opacity IS NULL;
    
    RAISE NOTICE 'Updated existing posts with default background styling';
END $$;
