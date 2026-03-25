-- ═══════════════════════════════════════════════════════════════
-- ROOFUS MATERIALS PORTAL — Supabase Database Setup
-- ═══════════════════════════════════════════════════════════════
-- Run this in Supabase SQL Editor (one time only)
-- ═══════════════════════════════════════════════════════════════

-- Key-value store — this is where ALL app data lives
-- The app stores JSON blobs under string keys (users, items, orders, etc.)
-- This keeps it simple and matches how the app already works
CREATE TABLE IF NOT EXISTS kv_store (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_kv_store_updated ON kv_store(updated_at);

-- Enable Row Level Security (required by Supabase)
ALTER TABLE kv_store ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated AND anonymous users to read/write
-- For a small team this is fine. If you want per-user security later,
-- you'd add Supabase Auth and filter by user ID.
CREATE POLICY "Allow all access" ON kv_store
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- THAT'S IT. The app handles everything else.
-- ═══════════════════════════════════════════════════════════════
