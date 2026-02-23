"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/types";

interface InstantShareModalProps {
  isOpen: boolean;
  challengeId: string;
  question: Question;
  onClose: () => void;
}

export default function InstantShareModal({
  isOpen,
  challengeId,
  question,
  onClose,
}: InstantShareModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/challenge/${challengeId}/play`
      : `/challenge/${challengeId}/play`;

  const shareText = `Can you guess my vibe? ${question.emoji} ${question.title} — Take the challenge!`;

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "VibeCheck",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fall back to clipboard
      }
    }
    handleCopyLink();
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt("Copy this link:", shareUrl);
    }
  }

  function handleDone() {
    onClose();
    router.push("/");
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="mx-auto max-w-lg rounded-t-3xl glass-strong border-t border-white/10 p-6 pb-10">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-neon-pink to-neon-purple text-3xl">
              {question.emoji}
            </div>
            <h3 className="text-lg font-bold text-white">
              Locked in! 🔒
            </h3>
            <p className="mt-1 text-sm text-white/50">
              Share this challenge and see if your friends can guess your vibe
            </p>
          </div>

          {/* Share actions */}
          <div className="flex flex-col gap-3">
            {/* Primary: Share button (uses native share or clipboard) */}
            <button
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span>📤</span>
              Share Challenge
            </button>

            {/* Secondary: Copy link */}
            <button
              onClick={handleCopyLink}
              className="flex w-full items-center justify-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-bold text-white/80 transition-all hover:bg-white/10 active:scale-95"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  Link Copied!
                </>
              ) : (
                <>
                  <span>🔗</span>
                  Copy Link
                </>
              )}
            </button>

            {/* Done */}
            <button
              onClick={handleDone}
              className="mt-2 text-sm font-medium text-white/40 transition-colors hover:text-white/60"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
