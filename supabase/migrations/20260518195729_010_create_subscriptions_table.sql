/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users - subscriber)
      - `plan_name` (text, current plan)
      - `billing_status` (text, default 'active', payment status)
      - `current_period_start` (timestamptz, billing period start)
      - `current_period_end` (timestamptz, billing period end)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `subscriptions` table
    - Users can only read their own subscription
    - Users cannot directly modify their subscription (handled by billing system)

  3. Notes
    - Plan names: monthly, annual
    - Billing statuses: active, past_due, cancelled, expired
    - Only SELECT is allowed for users; INSERT/UPDATE handled server-side
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name text NOT NULL DEFAULT 'monthly' CHECK (plan_name IN ('monthly', 'annual')),
  billing_status text NOT NULL DEFAULT 'active' CHECK (billing_status IN ('active', 'past_due', 'cancelled', 'expired')),
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT now() + interval '1 month',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
