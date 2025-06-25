/*
  # Create deals management table

  1. New Tables
    - `deals`
      - `id` (uuid, primary key)
      - `client_name` (text, not null) - שם הלקוח
      - `phone` (text, not null) - טלפון
      - `email` (text, not null) - אימייל
      - `source` (text, not null) - מקור הגעה
      - `package_type` (text, not null) - חבילה שנבחרה
      - `amount_paid` (decimal) - סכום ששולם
      - `payment_method` (text) - אמצעי תשלום
      - `status` (text, default 'open') - סטטוס העסקה
      - `closing_date` (date) - תאריך סגירה
      - `notes` (text) - הערות
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `deals` table
    - Add policy for authenticated users to manage deals
*/

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  source text NOT NULL,
  package_type text NOT NULL,
  amount_paid decimal(10,2),
  payment_method text,
  status text DEFAULT 'open',
  closing_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage deals"
  ON deals
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

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