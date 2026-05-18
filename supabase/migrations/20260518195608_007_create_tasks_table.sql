/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `assigned_user_id` (uuid, foreign key to users - responsible realtor)
      - `lead_id` (uuid, foreign key to leads - related lead, nullable)
      - `task_title` (text, action required)
      - `task_description` (text, additional details)
      - `due_date` (timestamptz, deadline)
      - `priority` (text, default 'medium', task priority)
      - `status` (text, default 'pending', task status)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `tasks` table
    - Realtors can only access tasks assigned to them
    - Tasks are owned by the assigned_user_id

  3. Notes
    - Priority levels: low, medium, high, urgent
    - Status values: pending, in_progress, completed, cancelled
    - lead_id is nullable since some tasks may not be lead-specific
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  task_title text NOT NULL DEFAULT '',
  task_description text DEFAULT '',
  due_date timestamptz DEFAULT now(),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Realtors can read own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (assigned_user_id = auth.uid());

CREATE POLICY "Realtors can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (assigned_user_id = auth.uid());

CREATE POLICY "Realtors can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (assigned_user_id = auth.uid())
  WITH CHECK (assigned_user_id = auth.uid());

CREATE POLICY "Realtors can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (assigned_user_id = auth.uid());

CREATE INDEX idx_tasks_assigned_user ON tasks(assigned_user_id);
CREATE INDEX idx_tasks_lead ON tasks(lead_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
