-- Create profile_settings table for storing site profile information
CREATE TABLE IF NOT EXISTS profile_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default profile settings
INSERT INTO profile_settings (setting_key, setting_value) VALUES
  ('profile_name', 'Justin Baird'),
  ('profile_title', 'Creative Technologist')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_profile_settings_updated_at ON profile_settings;
CREATE TRIGGER update_profile_settings_updated_at 
  BEFORE UPDATE ON profile_settings 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a simple personal site)
DROP POLICY IF EXISTS "Allow all operations on profile_settings" ON profile_settings;
CREATE POLICY "Allow all operations on profile_settings" 
  ON profile_settings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
