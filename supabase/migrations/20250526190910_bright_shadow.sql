/*
  # Update page_visits RLS policies

  1. Changes
    - Remove existing RLS policies for page_visits table
    - Add new policies with proper security controls
  
  2. Security
    - Allow anonymous users to insert with validation
    - Maintain existing read access for authenticated users
    - Add rate limiting by IP address
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Allow anonymous page visit tracking" ON page_visits;
DROP POLICY IF EXISTS "Allow authenticated users to view visits" ON page_visits;

-- Create new policies with proper security controls

-- Allow anonymous users to insert with validation
CREATE POLICY "Allow anonymous page visit tracking"
ON page_visits
FOR INSERT
TO anon
WITH CHECK (
  -- Ensure required fields are present
  page_id IS NOT NULL
  AND visit_time IS NOT NULL
  -- Basic validation
  AND length(page_id) <= 255
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

-- Create function and trigger for rate limiting
CREATE OR REPLACE FUNCTION check_page_visit_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if there are too many visits from this IP in the last minute
  IF EXISTS (
    SELECT 1
    FROM page_visits
    WHERE ip_address = NEW.ip_address
    AND visit_time > NOW() - INTERVAL '1 minute'
    GROUP BY ip_address
    HAVING COUNT(*) > 60  -- Maximum 60 visits per minute per IP
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded for IP address';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rate limiting
DROP TRIGGER IF EXISTS page_visits_rate_limit ON page_visits;
CREATE TRIGGER page_visits_rate_limit
  BEFORE INSERT ON page_visits
  FOR EACH ROW
  EXECUTE FUNCTION check_page_visit_rate_limit();