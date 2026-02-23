-- VibeCheck Migration v2: Swap Loop + Vibe Level + Link-based Access
-- Run this in Supabase SQL Editor

-- 1. Add swap_challenge_id to challenges table
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS swap_challenge_id uuid REFERENCES challenges(id);

-- 2. Add vibe_level to challenge_responses table
ALTER TABLE challenge_responses ADD COLUMN IF NOT EXISTS vibe_level text;

-- 3. Update RLS policy: allow any authenticated user to view a challenge by ID
-- (needed for link-based sharing where non-friends can open challenge links)
DROP POLICY IF EXISTS "Users can view challenges they are part of" ON challenges;
CREATE POLICY "Authenticated users can view any challenge"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

-- 4. Allow any authenticated user to view challenge responses for challenges they can see
DROP POLICY IF EXISTS "Users can view responses for their challenges" ON challenge_responses;
CREATE POLICY "Authenticated users can view challenge responses"
  ON challenge_responses FOR SELECT
  TO authenticated
  USING (true);

-- 5. Allow any authenticated user to create a response (for link-based play)
-- Keep the existing INSERT policy or create a permissive one
DROP POLICY IF EXISTS "Users can respond to challenges" ON challenge_responses;
CREATE POLICY "Authenticated users can respond to challenges"
  ON challenge_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = responder_id);

-- 6. Allow any authenticated user to become a challenge recipient (for link-based sharing)
DROP POLICY IF EXISTS "Users can be added as recipients" ON challenge_recipients;
CREATE POLICY "Authenticated users can join as recipients"
  ON challenge_recipients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = recipient_id);

-- Allow viewing recipients
DROP POLICY IF EXISTS "Users can view recipients" ON challenge_recipients;
CREATE POLICY "Authenticated users can view recipients"
  ON challenge_recipients FOR SELECT
  TO authenticated
  USING (true);

-- Allow updating recipient status
DROP POLICY IF EXISTS "Recipients can update their status" ON challenge_recipients;
DROP POLICY IF EXISTS "Recipients can update their own status" ON challenge_recipients;
CREATE POLICY "Recipients can update their own status"
  ON challenge_recipients FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id);
