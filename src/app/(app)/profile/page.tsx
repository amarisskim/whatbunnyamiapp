"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser, signOut, updateDisplayName } from "@/lib/auth";
import Header from "@/components/Header";

export default function ProfilePage() {
  const { user, profile, loading } = useUser();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
      </div>
    );
  }

  if (!user || !profile) return null;

  async function handleSaveName() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateDisplayName(name.trim());
      setEditing(false);
      // Refresh the page to show updated name
      window.location.reload();
    } catch {
      alert("Failed to update name");
    }
    setSaving(false);
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background pb-24">
      <Header title="Profile" />

      <div className="px-4 pt-16">
        {/* Avatar + Name card */}
        <div className="glass rounded-2xl p-6 text-center animate-fade-in">
          {/* Avatar */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 ring-2 ring-white/10">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white">
                {profile.display_name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>

          {/* Name */}
          {editing ? (
            <div className="flex flex-col items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-[200px] rounded-lg bg-white/[0.06] border border-white/[0.1] px-3 py-2 text-center text-sm text-white placeholder-white/30 outline-none focus:border-neon-cyan/50"
                placeholder="Your name"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveName}
                  disabled={saving}
                  className="rounded-full bg-neon-cyan/20 px-4 py-1.5 text-xs font-bold text-neon-cyan transition-all hover:bg-neon-cyan/30"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-full bg-white/[0.06] px-4 py-1.5 text-xs font-bold text-white/40 transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-white">
                {profile.display_name}
              </h2>
              <p className="mt-0.5 text-xs text-white/40">{user.email}</p>
              <button
                onClick={() => {
                  setName(profile.display_name || "");
                  setEditing(true);
                }}
                className="mt-2 text-xs font-medium text-neon-cyan/60 transition-colors hover:text-neon-cyan"
              >
                Edit name
              </button>
            </div>
          )}
        </div>

        {/* Invite code */}
        <div className="glass mt-4 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40">Your invite code</p>
              <p className="mt-0.5 font-mono text-sm font-bold text-white">
                {profile.invite_code}
              </p>
            </div>
            <button
              onClick={() => {
                const url = `${window.location.origin}/invite/${profile.invite_code}`;
                navigator.clipboard.writeText(url).catch(() => {});
              }}
              className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/60 transition-all hover:bg-white/10"
            >
              Copy link
            </button>
          </div>
        </div>

        {/* Account info */}
        <div className="glass mt-4 rounded-2xl p-4 animate-fade-in">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
            Account
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Email</span>
              <span className="text-xs text-white/60">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Member since</span>
              <span className="text-xs text-white/60">
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="mt-6 w-full rounded-full bg-white/[0.04] border border-white/[0.06] px-6 py-3 text-sm font-bold text-red-400/80 transition-all hover:bg-red-500/10 hover:border-red-500/20 active:scale-[0.98]"
        >
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
