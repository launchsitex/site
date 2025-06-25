/*
  # Add RLS policy for contact forms submissions
  
  1. Security
    - Enable RLS on contact_forms table
    - Add policy to allow anonymous submissions
    - Allow anyone to insert new contact form entries
*/

-- Enable RLS
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous submissions
CREATE POLICY "Allow anonymous contact form submissions"
ON contact_forms
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy for authenticated users to view their submissions
CREATE POLICY "Users can view contact form submissions"
ON contact_forms
FOR SELECT
TO authenticated
USING (true);