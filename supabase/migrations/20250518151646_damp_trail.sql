/*
  # Add accessibility logs table
  
  1. New Tables
    - `accessibility_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `feature` (text)
      - `details` (jsonb)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for user-specific access
*/

CREATE TABLE IF NOT EXISTS accessibility_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  feature text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE accessibility_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own logs"
ON accessibility_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs"
ON accessibility_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_accessibility_logs_user_id_created_at 
ON accessibility_logs(user_id, created_at);