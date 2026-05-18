/*
  # Create leads table

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `full_name` (text, lead identity)
      - `email` (text, contact method)
      - `phone` (text, contact method)
      - `budget` (numeric, buyer budget)
      - `preferred_location` (text, desired area)
      - `assigned_user_id` (uuid, foreign key to users - realtor ownership)
      - `pipeline_stage` (text, default 'new', sales progress)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `leads` table
    - Realtors can only access leads assigned to them
    - Admins can access all leads

  3. Notes
    - Pipeline stages: new, contacted, viewing_scheduled, negotiating, closed_won, closed_lost
    - assigned_user_id determines which realtor owns this lead
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  budget numeric DEFAULT 0,
  preferred_location text DEFAULT '',
  assigned_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pipeline_stage text NOT NULL DEFAULT 'new' CHECK (pipeline_stage IN ('new', 'contacted', 'viewing_scheduled', 'negotiating', 'closed_won', 'closed_lost')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Realtors can read own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (assigned_user_id = auth.uid());

CREATE POLICY "Realtors can insert own leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (assigned_user_id = auth.uid());

CREATE POLICY "Realtors can update own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (assigned_user_id = auth.uid())
  WITH CHECK (assigned_user_id = auth.uid());

CREATE POLICY "Realtors can delete own leads"
  ON leads FOR DELETE
  TO authenticated
  USING (assigned_user_id = auth.uid());

CREATE INDEX idx_leads_assigned_user ON leads(assigned_user_id);
CREATE INDEX idx_leads_pipeline_stage ON leads(pipeline_stage);
