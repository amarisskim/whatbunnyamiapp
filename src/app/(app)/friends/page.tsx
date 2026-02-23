"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/auth";
import { getFriends } from "@/lib/api/friends";
import { Profile } from "@/types";
import Header from "@/components/Header";
import FriendCard from "@/components/FriendCard";
import InviteLinkCard from "@/components/InviteLinkCard";
import EmptyState from "@/components/EmptyState";

export default function FriendsPage() {
  const { user, profile } = useUser();
  const [friends, setFriends] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadFriends();
  }, [user]);

  async function loadFriends() {
    if (!user) return;
    const data = await getFriends(user.id);
    setFriends(data);
    setLoading(false);
  }

  return (
    <div className="min-h-dvh bg-background">
      <Header title="Friends" showBack={false} />

      <div className="px-4 pt-16 pb-8">
        {/* Invite Link */}
        {profile?.invite_code && (
          <div className="mb-6">
            <InviteLinkCard inviteCode={profile.invite_code} />
          </div>
        )}

        {/* Friends List */}
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
            Your friends {friends.length > 0 && `(${friends.length})`}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
            </div>
          ) : friends.length === 0 ? (
            <EmptyState
              emoji="👯"
              title="No friends yet"
              description="Share your invite link above to connect with friends and start vibing together!"
            />
          ) : (
            <div className="flex flex-col gap-2">
              {friends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
