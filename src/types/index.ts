// --- Questions & Options ---

export type QuestionType = "PREFERENCE" | "IDENTITY";

export interface QuestionOption {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
}

export type QuestionSection = "self-select" | "algorithm";
export type QuestionNature = "choose" | "guess";

export interface Question {
  id: string;
  section: QuestionSection;
  nature: QuestionNature;
  type: QuestionType;
  title: string;
  prompt: string;
  emoji: string;
  coverImageUrl: string;
  options: QuestionOption[];
}

// --- Play Modes ---

export type PlayMode =
  | "solo"
  | "compare"
  | "guess-my-pick"
  | "two-player-guess";

// --- Results ---

export type ResultType = "correct" | "wrong" | "match" | "different";
export type VibeLevel = "soulmates" | "same-wavelength" | "beautifully-different";

// --- Database-backed types (Supabase) ---

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  invite_code: string;
  created_at: string;
  updated_at?: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
  // Joined field
  friend?: Profile;
}

export interface Challenge {
  id: string;
  sender_id: string;
  question_id: string;
  play_mode: PlayMode;
  sender_option_id: string | null;
  swap_challenge_id: string | null;
  status: "active" | "completed";
  created_at: string;
  // Joined fields
  sender?: Profile;
  recipients?: ChallengeRecipient[];
  responses?: ChallengeResponse[];
}

export interface ChallengeRecipient {
  id: string;
  challenge_id: string;
  recipient_id: string;
  status: "pending" | "completed";
  seen_at: string | null;
  created_at: string;
  // Joined fields
  challenge?: Challenge;
  recipient?: Profile;
}

export interface ChallengeResponse {
  id: string;
  challenge_id: string;
  responder_id: string;
  responder_option_id: string | null;
  responder_guess_id: string | null;
  is_correct: boolean | null;
  result_type: ResultType | null;
  vibe_level: VibeLevel | null;
  created_at: string;
  // Joined fields
  challenge?: Challenge;
  responder?: Profile;
}

export interface SavedChallenge {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}
