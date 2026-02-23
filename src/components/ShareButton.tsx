"use client";

import { useState } from "react";

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  label?: string;
  className?: string;
}

export default function ShareButton({
  url,
  title = "VibeCheck",
  text = "Can you guess my vibe? Take the challenge!",
  label = "Challenge a Friend",
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: fullUrl });
        return;
      } catch {
        // User cancelled or share failed, fall back to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort
      prompt("Copy this link:", fullUrl);
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <span>✓</span>
          Link Copied!
        </>
      ) : (
        <>
          <span>📤</span>
          {label}
        </>
      )}
    </button>
  );
}
