"use client";

import { useState } from "react";

export default function InviteLinkCard({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${inviteCode}`
      : `/invite/${inviteCode}`;

  async function handleShare() {
    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on VibeCheck!",
          text: "Let's see if we vibe 💜",
          url: inviteUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort
      prompt("Copy your invite link:", inviteUrl);
    }
  }

  return (
    <div className="glass rounded-2xl p-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-cyan/20 text-xl">
          🔗
        </span>
        <div>
          <h3 className="text-sm font-bold text-white">Your Invite Link</h3>
          <p className="text-xs text-white/40">
            Share this to add friends automatically
          </p>
        </div>
      </div>

      {/* Link display */}
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 mb-4">
        <p className="text-xs text-white/60 font-mono truncate">{inviteUrl}</p>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className={`w-full rounded-full px-6 py-3 text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 ${
          copied
            ? "bg-neon-cyan/20 text-neon-cyan"
            : "bg-gradient-to-r from-neon-cyan to-neon-purple text-white"
        }`}
      >
        {copied ? "Link Copied! ✓" : "Share Invite Link"}
      </button>
    </div>
  );
}
