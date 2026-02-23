import { createClient } from "@/lib/supabase/client";
import {
  Challenge,
  ChallengeRecipient,
  ChallengeResponse,
  PlayMode,
  SavedChallenge,
} from "@/types";

// Create a new challenge
export async function createChallenge(data: {
  senderId: string;
  questionId: string;
  playMode: PlayMode;
  senderOptionId?: string;
}): Promise<string | null> {
  const supabase = createClient();

  const { data: challenge, error } = await supabase
    .from("challenges")
    .insert({
      sender_id: data.senderId,
      question_id: data.questionId,
      play_mode: data.playMode,
      sender_option_id: data.senderOptionId || null,
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating challenge:", error);
    return null;
  }

  return challenge.id;
}

// Update sender's option pick on a challenge
export async function updateSenderOption(
  challengeId: string,
  optionId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("challenges")
    .update({ sender_option_id: optionId })
    .eq("id", challengeId);

  return !error;
}

// Send challenge to friends
export async function sendChallengeToFriends(
  challengeId: string,
  friendIds: string[]
): Promise<boolean> {
  const supabase = createClient();

  const rows = friendIds.map((friendId) => ({
    challenge_id: challengeId,
    recipient_id: friendId,
    status: "pending",
  }));

  const { error } = await supabase.from("challenge_recipients").insert(rows);

  if (error) {
    console.error("Error sending challenge:", error);
    return false;
  }

  return true;
}

// Respond to a challenge
export async function respondToChallenge(data: {
  challengeId: string;
  responderId: string;
  responderOptionId?: string;
  responderGuessId?: string;
  isCorrect?: boolean;
  resultType?: string;
  vibeLevel?: string;
}): Promise<boolean> {
  const supabase = createClient();

  // Insert the response
  const { error: responseError } = await supabase
    .from("challenge_responses")
    .insert({
      challenge_id: data.challengeId,
      responder_id: data.responderId,
      responder_option_id: data.responderOptionId || null,
      responder_guess_id: data.responderGuessId || null,
      is_correct: data.isCorrect ?? null,
      result_type: data.resultType || null,
      vibe_level: data.vibeLevel || null,
    });

  if (responseError) {
    console.error("Error responding to challenge:", responseError);
    return false;
  }

  // Update recipient status to completed
  await supabase
    .from("challenge_recipients")
    .update({ status: "completed" })
    .eq("challenge_id", data.challengeId)
    .eq("recipient_id", data.responderId);

  return true;
}

// Join a challenge as a recipient (for link-based sharing)
export async function joinChallenge(
  challengeId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  // Check if already a recipient
  const { data: existing } = await supabase
    .from("challenge_recipients")
    .select("id")
    .eq("challenge_id", challengeId)
    .eq("recipient_id", userId)
    .single();

  if (existing) return true; // Already joined

  const { error } = await supabase.from("challenge_recipients").insert({
    challenge_id: challengeId,
    recipient_id: userId,
    status: "pending",
  });

  if (error) {
    console.error("Error joining challenge:", error);
    return false;
  }

  return true;
}

// Create a swap challenge (reverse roles for the same question)
export async function createSwapChallenge(data: {
  originalChallengeId: string;
  senderId: string;
  questionId: string;
  playMode: PlayMode;
}): Promise<string | null> {
  const supabase = createClient();

  const { data: challenge, error } = await supabase
    .from("challenges")
    .insert({
      sender_id: data.senderId,
      question_id: data.questionId,
      play_mode: data.playMode,
      swap_challenge_id: data.originalChallengeId,
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating swap challenge:", error);
    return null;
  }

  return challenge.id;
}

// Get a single challenge by ID (with sender profile)
export async function getChallengeById(
  challengeId: string
): Promise<Challenge | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("challenges")
    .select("*, sender:profiles!challenges_sender_id_fkey(*)")
    .eq("id", challengeId)
    .single();

  if (error || !data) return null;
  return data as unknown as Challenge;
}

// Get challenges I sent
export async function getMySentChallenges(
  userId: string
): Promise<Challenge[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("challenges")
    .select(
      "*, sender:profiles!challenges_sender_id_fkey(*), responses:challenge_responses(*)"
    )
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as unknown as Challenge[];
}

// Get challenges sent to me (as recipient)
export async function getReceivedChallenges(
  userId: string
): Promise<(ChallengeRecipient & { challenge: Challenge })[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("challenge_recipients")
    .select(
      "*, challenge:challenges(*, sender:profiles!challenges_sender_id_fkey(*))"
    )
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as unknown as (ChallengeRecipient & {
    challenge: Challenge;
  })[];
}

// Get pending challenge count (for badge)
export async function getPendingChallengeCount(
  userId: string
): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("challenge_recipients")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .eq("status", "pending");

  if (error) return 0;
  return count || 0;
}

// Get response for a specific challenge + responder
export async function getResponse(
  challengeId: string,
  responderId: string
): Promise<ChallengeResponse | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("challenge_responses")
    .select("*")
    .eq("challenge_id", challengeId)
    .eq("responder_id", responderId)
    .single();

  if (error || !data) return null;
  return data as unknown as ChallengeResponse;
}

// Get all responses for a challenge
export async function getChallengeResponses(
  challengeId: string
): Promise<ChallengeResponse[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("challenge_responses")
    .select("*, responder:profiles!challenge_responses_responder_id_fkey(*)")
    .eq("challenge_id", challengeId);

  if (error) return [];
  return (data || []) as unknown as ChallengeResponse[];
}

// Saved challenges
export async function getSavedChallenges(
  userId: string
): Promise<SavedChallenge[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_challenges")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as SavedChallenge[];
}
