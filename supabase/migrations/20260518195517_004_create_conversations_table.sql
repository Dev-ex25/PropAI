/*
  # Create conversations table

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, foreign key to leads - related lead)
      - `message_content` (text, stored message)
      - `sender_type` (text, user/ai/lead)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `conversations` table
    - Realtors can only access conversations for leads assigned to them
    - Access is derived through the leads table ownership

  3. Notes
    - Sender types: 'user' (realtor), 'ai' (PropAI assistant), 'lead' (prospect)
    - Conversations are linked to leads, not directly to users
    - This gives AI memory of all past communications per lead
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  message_content text NOT NULL DEFAULT '',
  sender_type text NOT NULL DEFAULT 'user' CHECK (sender_type IN ('user', 'ai', 'lead')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Realtors can read own lead conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = conversations.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE POLICY "Realtors can insert conversations for own leads"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = conversations.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE POLICY "Realtors can delete conversations for own leads"
  ON conversations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = conversations.lead_id
      AND leads.assigned_user_id = auth.uid()
    )
  );

CREATE INDEX idx_conversations_lead ON conversations(lead_id);
CREATE INDEX idx_conversations_created ON conversations(created_at);
