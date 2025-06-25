/*
  # Add page visits tracking table
  
  1. New Tables
    - `page_visits`
      - `id` (uuid, primary key)
      - `page_id` (text, not null)
      - `visit_time` (timestamptz, default now())
      - `source` (text)
      - `user_agent` (text)
      - `ip_address` (text)
  
  2. Security
    - Enable RLS on page_visits table
    - Add policies for:
      - Anonymous users to insert
      - Authenticated users to read
*/

-- Create the page_visits table
CREATE TABLE IF NOT EXISTS page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text NOT NULL,
  visit_time timestamptz DEFAULT now(),
  source text,
  user_agent text,
  ip_address text
);

-- Enable RLS
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous page visit tracking"
ON page_visits
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view visits"
ON page_visits
FOR SELECT
TO authenticated
USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_visits_visit_time 
ON page_visits(visit_time);

-- Create index for page_id queries
CREATE INDEX IF NOT EXISTS idx_page_visits_page_id 
ON page_visits(page_id);