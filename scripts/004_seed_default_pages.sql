-- Insert default homepage configuration
INSERT INTO pages (title, slug, meta_description, is_published, is_homepage) 
VALUES (
  'Justin Baird - Portfolio', 
  'home', 
  'Creative portfolio showcasing design and development work',
  true,
  true
) ON CONFLICT (slug) DO NOTHING;

-- Get the homepage ID for content blocks
DO $$
DECLARE
  homepage_id UUID;
BEGIN
  SELECT id INTO homepage_id FROM pages WHERE slug = 'home';
  
  -- Insert default content blocks for homepage
  INSERT INTO content_blocks (page_id, block_type, content, position) VALUES
  (homepage_id, 'hero', '{
    "title": "Justin Baird",
    "subtitle": "Creative Designer & Developer",
    "description": "Crafting digital experiences with passion and precision",
    "buttonText": "View My Work",
    "buttonLink": "#portfolio"
  }', 1),
  
  (homepage_id, 'portfolio', '{
    "title": "Featured Work",
    "showFeaturedOnly": true,
    "layout": "grid"
  }', 2),
  
  (homepage_id, 'contact', '{
    "title": "Get In Touch",
    "email": "hello@justinbaird.com",
    "showForm": true
  }', 3);
END $$;
