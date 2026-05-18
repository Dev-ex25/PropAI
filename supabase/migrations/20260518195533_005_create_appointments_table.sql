/*
  # Create appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, foreign key to leads - related lead)
      - `property_id` (uuid, foreign key to properties - related property)
      - `appointment_date` (timestamptz, scheduled viewing)
      - `status` (text, default 'scheduled', appointment status)
      - `notes` (text, optional notes)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `appointments` table
    - Realtors can only access appointments for their own leads and properties
    - Access is derived through lead ownership

  3. Notes
    - Appointment statuses: scheduled, completed, cancelled, no_show
    - Links both a lead and a property for viewing appointments
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  appointment_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Realtors can read own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = appointments.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE POLICY "Realtors can insert appointments for own leads"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = appointments.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE POLICY "Realtors can update appointments for own leads"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = appointments.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE POLICY "Realtors can delete appointments for own leads"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = appointments.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE INDEX idx_appointments_lead ON appointments(lead_id);
CREATE INDEX idx_appointments_property ON appointments(property_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
