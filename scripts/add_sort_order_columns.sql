-- Adding sort_order columns to pages and posts tables for navigation ordering
ALTER TABLE pages ADD COLUMN sort_order INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Set initial sort_order values based on created_at
UPDATE pages SET sort_order = ROW_NUMBER() OVER (ORDER BY created_at);
UPDATE posts SET sort_order = ROW_NUMBER() OVER (ORDER BY created_at);

-- Add indexes for better performance
CREATE INDEX idx_pages_sort_order ON pages(sort_order);
CREATE INDEX idx_posts_sort_order ON posts(sort_order);
