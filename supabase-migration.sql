-- VibeCheck Content Restructuring Migration
-- Run this in Supabase SQL Editor
-- WARNING: This drops and recreates challenge-related tables. All existing challenge data will be lost.
-- profiles and friendships tables are NOT touched.

-- Step 1: Drop old tables (order matters due to foreign keys)
DROP TABLE IF EXISTS challenge_responses CASCADE;
DROP TABLE IF EXISTS challenge_recipients CASCADE;
DROP TABLE IF EXISTS saved_challenges CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;

-- Step 2: Create new challenges table
CREATE TABLE challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  play_mode TEXT NOT NULL CHECK (play_mode IN ('solo', 'compare', 'guess-my-pick', 'two-player-guess')),
  sender_option_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges: INSERT policy (any authenticated user)
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create challenges"
  ON challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own challenges"
  ON challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Step 3: Create challenge_recipients table
CREATE TABLE challenge_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, recipient_id)
);

ALTER TABLE challenge_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own received challenges"
  ON challenge_recipients FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can insert recipients for own challenges"
  ON challenge_recipients FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM challenges WHERE id = challenge_id AND sender_id = auth.uid()
    )
  );

CREATE POLICY "Recipients can update their own status"
  ON challenge_recipients FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id);

-- Step 4: NOW add the challenges SELECT policy (after challenge_recipients exists)
CREATE POLICY "Users can see challenges they sent or received"
  ON challenges FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id
    OR EXISTS (
      SELECT 1 FROM challenge_recipients
      WHERE challenge_id = id AND recipient_id = auth.uid()
    )
  );

-- Step 5: Create challenge_responses table
CREATE TABLE challenge_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  responder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  responder_option_id TEXT,
  responder_guess_id TEXT,
  is_correct BOOLEAN,
  result_type TEXT CHECK (result_type IN ('correct', 'wrong', 'match', 'different')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, responder_id)
);

ALTER TABLE challenge_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see responses for challenges they're involved in"
  ON challenge_responses FOR SELECT
  TO authenticated
  USING (
    auth.uid() = responder_id
    OR EXISTS (
      SELECT 1 FROM challenges WHERE id = challenge_id AND sender_id = auth.uid()
    )
  );

CREATE POLICY "Users can respond to challenges"
  ON challenge_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = responder_id);

-- Step 6: Create saved_challenges table
CREATE TABLE saved_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE saved_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved challenges"
  ON saved_challenges FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
