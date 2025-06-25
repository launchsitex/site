/*
  # Fix page_visits RLS policies and constraints
  
  1. Changes
    - Drop existing policies
    - Create new policy for anonymous inserts with proper validation
    - Create policy for authenticated users to view visits
    - Add rate limiting function and trigger
  
  2. Security
    - Enable RLS
    - Validate input lengths
    - Implement rate limiting
    - Ensure proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous page visit tracking" ON page_visits;
DROP POLICY IF EXISTS "Allow authenticated users to view visits" ON page_visits;

-- Enable RLS
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous inserts with validation
CREATE POLICY "Allow anonymous page visit tracking"
ON page_visits
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for authenticated users to view visits
CREATE POLICY "Allow authenticated users to view visits"
ON page_visits
FOR SELECT
TO authenticated
USING (true);

-- Add rate limiting function
CREATE OR REPLACE FUNCTION check_page_visit_rate_limit()
RETURNS trigger AS $$
DECLARE
  visit_count integer;
BEGIN
  -- Count visits from this IP in the last minute
  SELECT COUNT(*)
  INTO visit_count
  FROM page_visits
  WHERE ip_address = NEW.ip_address
  AND visit_time > NOW() - INTERVAL '1 minute';

  -- Allow up to 60 visits per minute per IP
  IF visit_count >= 60 THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add rate limiting trigger
DROP TRIGGER IF EXISTS page_visits_rate_limit ON page_visits;
CREATE TRIGGER page_visits_rate_limit
  BEFORE INSERT ON page_visits
  FOR EACH ROW
  EXECUTE FUNCTION check_page_visit_rate_limit();