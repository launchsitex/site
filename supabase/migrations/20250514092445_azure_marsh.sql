/*
  # Fix contact forms RLS policies
  
  1. Security Changes
    - Enable RLS on contact_forms table
    - Add policy for anonymous form submissions
    - Add policy for public form viewing
    - Add policy for authenticated users to manage forms
*/

-- Enable RLS
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON contact_forms;
DROP POLICY IF EXISTS "Users can view contact form submissions" ON contact_forms;
DROP POLICY IF EXISTS "Users can update contact form submissions" ON contact_forms;
DROP POLICY IF EXISTS "Allow public to view contact forms" ON contact_forms;

-- Allow anonymous submissions
CREATE POLICY "Allow anonymous contact form submissions"
ON contact_forms
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow public to view contact forms
CREATE POLICY "Allow public to view contact forms"
ON contact_forms
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to update and delete
CREATE POLICY "Allow authenticated users to manage contact forms"
ON contact_forms
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);