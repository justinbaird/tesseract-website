-- Add background image field to profile_settings
INSERT INTO profile_settings (setting_key, setting_value) VALUES
  ('background_image_url', '/web-background.jpg')
ON CONFLICT (setting_key) DO NOTHING;

-- Show current profile settings for verification
SELECT setting_key, setting_value, updated_at 
FROM profile_settings 
ORDER BY setting_key;
