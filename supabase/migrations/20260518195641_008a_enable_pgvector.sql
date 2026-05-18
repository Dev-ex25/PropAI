/*
  # Enable pgvector extension

  1. Extensions
    - Enable `vector` extension for AI embedding storage

  2. Notes
    - Required for the ai_memory table's embedding_vector column
    - Supabase supports pgvector natively
*/

CREATE EXTENSION IF NOT EXISTS vector;
