-- ============================================
-- VibeCheck Supabase Setup
-- Run this ENTIRE script in your Supabase SQL Editor
-- (Go to Supabase Dashboard → SQL Editor → New Query → Paste this → Run)
-- ============================================

-- 1. Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Helper function to generate short invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  code text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLE: profiles
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  invite_code text UNIQUE NOT NULL DEFAULT generate_invite_code(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- TABLE: friendships (bidirectional)
-- ============================================
CREATE TABLE IF NOT EXISTS public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- RLS for friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships involving themselves"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLE: challenges (create table + basic RLS first)
-- ============================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('pick-self', 'pick-partner', 'guess-pick', 'identify')),
  sender_pick_id text,
  sender_target_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create challenges"
  ON public.challenges FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own challenges"
  ON public.challenges FOR UPDATE
  USING (auth.uid() = sender_id);

-- ============================================
-- TABLE: challenge_recipients
-- ============================================
CREATE TABLE IF NOT EXISTS public.challenge_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, recipient_id)
);

-- RLS for challenge_recipients
ALTER TABLE public.challenge_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own challenge_recipients"
  ON public.challenge_recipients FOR SELECT
  USING (
    auth.uid() = recipient_id
    OR challenge_id IN (
      SELECT id FROM public.challenges WHERE sender_id = auth.uid()
    )
  );

CREATE POLICY "Challenge senders can insert recipients"
  ON public.challenge_recipients FOR INSERT
  WITH CHECK (
    challenge_id IN (
      SELECT id FROM public.challenges WHERE sender_id = auth.uid()
    )
  );

CREATE POLICY "Recipients can update their own status"
  ON public.challenge_recipients FOR UPDATE
  USING (auth.uid() = recipient_id);

-- ============================================
-- NOW add the challenges SELECT policy (needs challenge_recipients to exist)
-- ============================================
CREATE POLICY "Users can read challenges they sent or received"
  ON public.challenges FOR SELECT
  USING (
    auth.uid() = sender_id
    OR id IN (
      SELECT challenge_id FROM public.challenge_recipients
      WHERE recipient_id = auth.uid()
    )
  );

-- ============================================
-- TABLE: challenge_responses
-- ============================================
CREATE TABLE IF NOT EXISTS public.challenge_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  responder_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  responder_pick_id text,
  responder_guess_id text,
  sync_tier text,
  sync_score integer,
  shared_tags text[],
  result_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, responder_id)
);

-- RLS for challenge_responses
ALTER TABLE public.challenge_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read responses they created or for their challenges"
  ON public.challenge_responses FOR SELECT
  USING (
    auth.uid() = responder_id
    OR challenge_id IN (
      SELECT id FROM public.challenges WHERE sender_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own responses"
  ON public.challenge_responses FOR INSERT
  WITH CHECK (auth.uid() = responder_id);

-- ============================================
-- TABLE: saved_challenges (bookmarks)
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('pick-self', 'pick-partner', 'guess-pick', 'identify')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, category_id, mode)
);

-- RLS for saved_challenges
ALTER TABLE public.saved_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved_challenges"
  ON public.saved_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save challenges"
  ON public.saved_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave challenges"
  ON public.saved_challenges FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Done! All 6 tables created with RLS policies.
-- ============================================
