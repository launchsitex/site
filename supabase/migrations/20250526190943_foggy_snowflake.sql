/*
  # Fix page visits RLS policies
  
  1. Changes
    - Update RLS policies to allow anonymous inserts
    - Add data validation constraints
    - Maintain view permissions for authenticated users
  
  2. Security
    - Enable RLS
    - Add proper policies for anonymous and authenticated access
    - Add input validation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous page visit tracking" ON page_visits;
DROP POLICY IF EXISTS "Allow authenticated users to view visits" ON page_visits;

-- Create new policies with proper validation
CREATE POLICY "Allow anonymous page visit tracking"
ON page_visits
FOR INSERT
TO anon
WITH CHECK (
  (page_id IS NOT NULL) AND
  (length(page_id) <= 255) AND
  ((source IS NULL) OR (length(source) <= 255)) AND
  ((user_agent IS NULL) OR (length(user_agent) <= 1024)) AND
  ((ip_address IS NULL) OR (length(ip_address) <= 45))
);

CREATE POLICY "Allow authenticated users to view visits"
ON page_visits
FOR SELECT
TO authenticated
USING (true);

-- Create function to check rate limit
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

  -- Allow max 60 visits per minute per IP
  IF visit_count >= 60 THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create rate limit trigger
DROP TRIGGER IF EXISTS page_visits_rate_limit ON page_visits;
CREATE TRIGGER page_visits_rate_limit
  BEFORE INSERT ON page_visits
  FOR EACH ROW
  EXECUTE FUNCTION check_page_visit_rate_limit();