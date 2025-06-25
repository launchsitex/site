/*
  # Fix deals table and RLS policies
  
  1. Changes
    - Ensure deals table exists with correct structure
    - Fix RLS policies for proper access control
    - Add proper validation and constraints
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Ensure data integrity
*/

-- Create deals table if it doesn't exist
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  source text NOT NULL,
  package_type text NOT NULL,
  amount_paid decimal(10,2),
  payment_method text,
  status text DEFAULT 'פתוחה',
  closing_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can manage deals" ON deals;
DROP POLICY IF EXISTS "Allow authenticated users to manage deals" ON deals;

-- Create comprehensive policies for authenticated users
CREATE POLICY "Allow authenticated users to view deals"
  ON deals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert deals"
  ON deals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update deals"
  ON deals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete deals"
  ON deals
  FOR DELETE
  TO authenticated
  USING (true);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;

-- Create trigger to update updated_at
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_deals_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_package_type ON deals(package_type);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);
CREATE INDEX IF NOT EXISTS idx_deals_source ON deals(source);
CREATE INDEX IF NOT EXISTS idx_deals_client_name ON deals(client_name);