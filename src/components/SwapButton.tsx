"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSwapChallenge } from "@/lib/api/challenges";
import { PlayMode } from "@/types";

interface SwapButtonProps {
  originalChallengeId: string;
  senderName: string;
  senderId: string;
  questionId: string;
  playMode: PlayMode;
  currentUserId: string;
}

export default function SwapButton({
  originalChallengeId,
  senderName,
  questionId,
  playMode,
  currentUserId,
}: SwapButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSwap() {
    setLoading(true);

    const newChallengeId = await createSwapChallenge({
      originalChallengeId,
      senderId: currentUserId,
      questionId,
      playMode,
    });

    if (newChallengeId) {
      router.push(`/challenge/${newChallengeId}/play`);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleSwap}
      disabled={loading}
      className="w-full animate-slide-up rounded-2xl glass group flex items-center gap-4 p-4 transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-pink/20 text-2xl">
        🔄
      </span>
      <div className="text-left">
        <h3 className="text-sm font-bold text-white">
          {loading ? "Creating..." : `Challenge ${senderName} back!`}
        </h3>
        <p className="text-xs text-white/50">
          Now make them guess YOUR favorite
        </p>
      </div>
      <span className="ml-auto text-white/30">→</span>
    </button>
  );
}
