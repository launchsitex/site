/*
  # Fix contact forms RLS policies
  
  1. Changes
    - Add proper RLS policies for contact forms table
    - Allow anonymous users to insert new entries
    - Allow authenticated users to view submissions
  
  2. Security
    - Maintain data security while allowing necessary operations
    - Ensure proper access control
*/

-- Enable RLS
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON contact_forms;
DROP POLICY IF EXISTS "Users can view contact form submissions" ON contact_forms;

-- Create policy for anonymous submissions
CREATE POLICY "Allow anonymous contact form submissions"
ON contact_forms
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy for authenticated users to view submissions
CREATE POLICY "Users can view contact form submissions"
ON contact_forms
FOR SELECT
TO authenticated
USING (true);

-- Create policy for authenticated users to update submissions
CREATE POLICY "Users can update contact form submissions"
ON contact_forms
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);