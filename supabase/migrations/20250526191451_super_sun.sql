/*
  # Fix page_visits RLS policies
  
  1. Changes
    - Drop existing RLS policies
    - Create new policies that properly handle anonymous inserts
    - Add validation checks for input data
  
  2. Security
    - Ensure proper access control while allowing anonymous tracking
    - Add input validation to prevent abuse
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous page visit tracking" ON page_visits;
DROP POLICY IF EXISTS "Allow authenticated users to view visits" ON page_visits;

-- Create new policies with proper checks
CREATE POLICY "Allow anonymous page visit tracking"
ON page_visits
FOR INSERT
TO anon
WITH CHECK (
  -- Validate page_id
  page_id IS NOT NULL 
  AND length(page_id) <= 255
  -- Optional fields validation
  AND (source IS NULL OR length(source) <= 255)
  AND (user_agent IS NULL OR length(user_agent) <= 1024)
  AND (ip_address IS NULL OR length(ip_address) <= 45)
);

-- Allow authenticated users to view all visits
CREATE POLICY "Allow authenticated users to view visits"
ON page_visits
FOR SELECT
TO authenticated
USING (true);

-- Add rate limiting function
CREATE OR REPLACE FUNCTION check_page_visit_rate_limit()
RETURNS trigger AS $$
DECLARE
  recent_visits INTEGER;
BEGIN
  -- Count visits from same IP in last minute
  SELECT COUNT(*)
  INTO recent_visits
  FROM page_visits
  WHERE 
    ip_address = NEW.ip_address 
    AND visit_time > NOW() - INTERVAL '1 minute';
    
  IF recent_visits >= 20 THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create rate limiting trigger
DROP TRIGGER IF EXISTS page_visits_rate_limit ON page_visits;
CREATE TRIGGER page_visits_rate_limit
  BEFORE INSERT ON page_visits
  FOR EACH ROW
  EXECUTE FUNCTION check_page_visit_rate_limit();