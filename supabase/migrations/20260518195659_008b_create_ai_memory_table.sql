/*
  # Create ai_memory table

  1. New Tables
    - `ai_memory`
      - `id` (uuid, primary key)
      - `entity_id` (uuid, related lead or property ID)
      - `entity_type` (text, whether this memory relates to a lead or property)
      - `raw_content` (text, stored memory text)
      - `embedding_vector` (vector(1536), AI searchable memory)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `ai_memory` table
    - Realtors can only access AI memory for entities they own
    - Access is derived through lead/property ownership

  3. Notes
    - entity_type: 'lead' or 'property' - determines which table entity_id references
    - embedding_vector uses pgvector for similarity search
    - This table enables the AI assistant to have persistent contextual knowledge
*/

CREATE TABLE IF NOT EXISTS ai_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL,
  entity_type text NOT NULL DEFAULT 'lead' CHECK (entity_type IN ('lead', 'property')),
  raw_content text NOT NULL DEFAULT '',
  embedding_vector vector(1536),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Realtors can read AI memory for own leads"
  ON ai_memory FOR SELECT
  TO authenticated
  USING (
    (entity_type = 'lead' AND EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = ai_memory.entity_id
      AND leads.assigned_user_id = auth.uid()
    ))
    OR
    (entity_type = 'property' AND EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = ai_memory.entity_id
      AND properties.realtor_id = auth.uid()
    ))
  );

CREATE POLICY "Realtors can insert AI memory for own entities"
  ON ai_memory FOR INSERT
  TO authenticated
  WITH CHECK (
    (entity_type = 'lead' AND EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = ai_memory.entity_id
      AND leads.assigned_user_id = auth.uid()
    ))
    OR
    (entity_type = 'property' AND EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = ai_memory.entity_id
      AND properties.realtor_id = auth.uid()
    ))
  );

CREATE POLICY "Realtors can delete AI memory for own entities"
  ON ai_memory FOR DELETE
  TO authenticated
  USING (
    (entity_type = 'lead' AND EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = ai_memory.entity_id
      AND leads.assigned_user_id = auth.uid()
    ))
    OR
    (entity_type = 'property' AND EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = ai_memory.entity_id
      AND properties.realtor_id = auth.uid()
    ))
  );

CREATE INDEX idx_ai_memory_entity ON ai_memory(entity_id, entity_type);
