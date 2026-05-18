/*
  # Create properties table

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text, listing name)
      - `description` (text, property details)
      - `price` (numeric, listing price)
      - `property_type` (text, house/apartment/etc)
      - `location` (text, property area)
      - `realtor_id` (uuid, foreign key to users - listing owner)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `properties` table
    - Realtors can only access their own listings
    - Admins can access all listings

  3. Notes
    - Property types: house, apartment, penthouse, villa, commercial, land
    - Realtor_id determines ownership of the listing
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  property_type text NOT NULL DEFAULT 'apartment' CHECK (property_type IN ('house', 'apartment', 'penthouse', 'villa', 'commercial', 'land')),
  location text DEFAULT '',
  realtor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Realtors can read own properties"
  ON properties FOR SELECT
  TO authenticated
  USING (realtor_id = auth.uid());

CREATE POLICY "Realtors can insert own properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (realtor_id = auth.uid());

CREATE POLICY "Realtors can update own properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (realtor_id = auth.uid())
  WITH CHECK (realtor_id = auth.uid());

CREATE POLICY "Realtors can delete own properties"
  ON properties FOR DELETE
  TO authenticated
  USING (realtor_id = auth.uid());

CREATE INDEX idx_properties_realtor ON properties(realtor_id);
CREATE INDEX idx_properties_type ON properties(property_type);
