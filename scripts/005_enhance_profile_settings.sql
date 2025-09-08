-- Add social media fields to profile_settings
INSERT INTO profile_settings (setting_key, setting_value) VALUES
  ('linkedin_url', 'https://www.linkedin.com/in/justinbaird/'),
  ('instagram_url', 'https://www.instagram.com/justinbaird.sg/'),
  ('youtube_url', 'https://www.youtube.com/@Tesseract-Art')
ON CONFLICT (setting_key) DO NOTHING;

-- Update existing profile settings to correct values (if they were reverted)
UPDATE profile_settings 
SET setting_value = 'Tesseract Art', updated_at = NOW() 
WHERE setting_key = 'profile_name';

UPDATE profile_settings 
SET setting_value = '', updated_at = NOW() 
WHERE setting_key = 'profile_title';

-- Show current profile settings for verification
SELECT setting_key, setting_value, updated_at 
FROM profile_settings 
ORDER BY setting_key;
