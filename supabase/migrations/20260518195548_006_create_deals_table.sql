/*
  # Create deals table

  1. New Tables
    - `deals`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, foreign key to leads - buyer/renter)
      - `property_id` (uuid, foreign key to properties - property sold)
      - `deal_value` (numeric, transaction amount)
      - `deal_stage` (text, default 'proposed', transaction progress)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `deals` table
    - Realtors can only access deals for their own leads
    - Access is derived through lead ownership

  3. Notes
    - Deal stages: proposed, under_review, accepted, rejected, completed
    - Links a lead (buyer) with a property (listing) and tracks the transaction
*/

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  deal_value numeric NOT NULL DEFAULT 0,
  deal_stage text NOT NULL DEFAULT 'proposed' CHECK (deal_stage IN ('proposed', 'under_review', 'accepted', 'rejected', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Realtors can read own deals"
  ON deals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = deals.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE POLICY "Realtors can insert deals for own leads"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = deals.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE POLICY "Realtors can update deals for own leads"
  ON deals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = deals.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE POLICY "Realtors can delete deals for own leads"
  ON deals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = deals.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE INDEX idx_deals_lead ON deals(lead_id);
CREATE INDEX idx_deals_property ON deals(property_id);
CREATE INDEX idx_deals_stage ON deals(deal_stage);
