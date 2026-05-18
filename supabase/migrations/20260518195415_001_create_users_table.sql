/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text, user display name)
      - `email` (text, unique, login credential)
      - `password_hash` (text, secure authentication - managed by Supabase Auth)
      - `role` (text, default 'realtor', permission control)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `users` table
    - Users can read their own data
    - Users can update their own data
    - No public access

  3. Notes
    - The `id` column references `auth.users` so this table extends Supabase Auth
    - `password_hash` is managed by Supabase Auth internally; this field is for reference only
    - Role defaults to 'realtor'; admin role grants elevated permissions
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text UNIQUE NOT NULL,
  password_hash text DEFAULT '',
  role text NOT NULL DEFAULT 'realtor' CHECK (role IN ('realtor', 'admin')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
