"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { useUser } from "@/lib/auth";
import { createChallenge } from "@/lib/api/challenges";
import VerticalScroll from "@/components/VerticalScroll";

export default function DiscoverPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // Shuffle questions for discovery
  const shuffled = useMemo(() => {
    const arr = [...questions];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(((i * 7 + 3) % arr.length));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  async function handlePlay(questionId: string) {
    if (!user || loading) return;
    setLoading(true);

    // Create a solo challenge immediately and go straight to play
    const challengeId = await createChallenge({
      senderId: user.id,
      questionId,
      playMode: "solo",
    });

    if (challengeId) {
      router.push(`/challenge/${challengeId}/play`);
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background">
      {/* Back button (floating) */}
      <Link
        href="/"
        className="glass-strong fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white active:scale-95"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* "Discover" label */}
      <div className="glass-strong fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-1.5">
        <span className="text-xs font-semibold tracking-wide text-white/80">
          🔥 Discover
        </span>
      </div>

      <VerticalScroll>
        {shuffled.map((q) => (
          <div key={q.id} className="relative h-full w-full">
            {/* Full bleed cover image */}
            <Image
              src={q.coverImageUrl}
              alt={q.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-12">
              <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
                {q.emoji}{" "}
                {q.section === "self-select" ? "About Me" : "About Friends"}
              </span>

              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                {q.title}
              </h2>

              <p className="mt-1 text-sm text-white/60">{q.prompt}</p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white/70">
                  {q.type === "PREFERENCE" ? "Your Pick" : "Personality"}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white/70">
                  {q.options.length} options
                </span>
              </div>

              <div className="mt-4 flex gap-3">
                {/* Instant play button */}
                <button
                  onClick={() => handlePlay(q.id)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Starting..." : "Play →"}
                </button>

                {/* Browse all modes link */}
                <Link
                  href={`/library/${q.id}`}
                  className="inline-flex items-center gap-1 rounded-full glass px-4 py-2.5 text-xs font-bold text-white/60 transition-all hover:text-white/80"
                >
                  More modes
                </Link>
              </div>
            </div>

            {/* Swipe hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-pulse-glow">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.4}
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        ))}
      </VerticalScroll>
    </div>
  );
}
