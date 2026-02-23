import { createClient } from "@/lib/supabase/client";
import { Profile, Friendship } from "@/types";

// Get all friends for a user (with their profiles)
export async function getFriends(userId: string): Promise<Profile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("friendships")
    .select("friend_id, friend:profiles!friendships_friend_id_fkey(*)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching friends:", error);
    return [];
  }

  // Extract friend profiles from the join
  return (data || [])
    .map((row: Record<string, unknown>) => row.friend as Profile)
    .filter(Boolean);
}

// Add a bidirectional friendship
export async function addFriend(
  userId: string,
  friendId: string
): Promise<boolean> {
  if (userId === friendId) return false;

  const supabase = createClient();

  // Check if friendship already exists
  const { data: existing } = await supabase
    .from("friendships")
    .select("id")
    .eq("user_id", userId)
    .eq("friend_id", friendId)
    .single();

  if (existing) return true; // Already friends

  // Create bidirectional friendship (A→B and B→A)
  const { error } = await supabase.from("friendships").insert([
    { user_id: userId, friend_id: friendId },
    { user_id: friendId, friend_id: userId },
  ]);

  if (error) {
    console.error("Error adding friend:", error);
    return false;
  }

  return true;
}

// Look up a user by their invite code
export async function getProfileByInviteCode(
  code: string
): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("invite_code", code)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

// Remove a friendship (bidirectional)
export async function removeFriend(
  userId: string,
  friendId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("friendships")
    .delete()
    .or(
      `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
    );

  if (error) {
    console.error("Error removing friend:", error);
    return false;
  }

  return true;
}
