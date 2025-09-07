-- Create a storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true);

-- Set up storage policies to allow public access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
