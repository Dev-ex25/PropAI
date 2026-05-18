/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users - receiver)
      - `content` (text, alert message)
      - `notification_type` (text, category of notification)
      - `read_status` (boolean, default false, seen/unseen)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `notifications` table
    - Users can only access their own notifications
    - Users can mark their own notifications as read

  3. Notes
    - Notification types: lead_activity, appointment_reminder, deal_update, task_due, system
    - read_status false = unseen, true = seen
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  notification_type text NOT NULL DEFAULT 'system' CHECK (notification_type IN ('lead_activity', 'appointment_reminder', 'deal_update', 'task_due', 'system')),
  read_status boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read_status);
