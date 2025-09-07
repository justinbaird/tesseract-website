-- Add sort_order columns to both pages and posts tables
ALTER TABLE pages ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Set initial sort_order values based on created_at
UPDATE pages SET sort_order = (
  SELECT ROW_NUMBER() OVER (ORDER BY created_at)
  FROM (SELECT id, created_at FROM pages ORDER BY created_at) AS ordered_pages
  WHERE ordered_pages.id = pages.id
);

UPDATE posts SET sort_order = (
  SELECT ROW_NUMBER() OVER (ORDER BY created_at)
  FROM (SELECT id, created_at FROM posts ORDER BY created_at) AS ordered_posts
  WHERE ordered_posts.id = posts.id
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_sort_order ON pages(sort_order);
CREATE INDEX IF NOT EXISTS idx_posts_sort_order ON posts(sort_order);
