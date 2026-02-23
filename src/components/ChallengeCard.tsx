"use client";

import Link from "next/link";
import { getQuestionById } from "@/data/questions";
import { PlayMode, ResultType, VibeLevel } from "@/types";
import VibeGauge from "@/components/VibeGauge";

const playModeLabels: Record<PlayMode, string> = {
  solo: "🎯 Solo",
  compare: "🤝 Compare",
  "guess-my-pick": "🔮 Guess My Pick",
  "two-player-guess": "🧠 Two-Player Guess",
};

interface ChallengeCardProps {
  id: string;
  questionId: string;
  playMode: PlayMode;
  senderName?: string;
  status: "pending" | "completed" | "active" | "saved";
  resultType?: ResultType | null;
  vibeLevel?: VibeLevel | null;
  isSender?: boolean;
}

export default function ChallengeCard({
  id,
  questionId,
  playMode,
  senderName,
  status,
  resultType,
  vibeLevel,
  isSender,
}: ChallengeCardProps) {
  const question = getQuestionById(questionId);
  if (!question) return null;

  // Determine link destination
  let href = "/library";
  if (status === "saved") {
    href = `/library/${questionId}`;
  } else if (status === "pending") {
    href = `/challenge/${id}/play`;
  } else if (status === "completed") {
    href = `/challenge/${id}/results`;
  } else if (status === "active" && isSender) {
    href = `/challenge/${id}/results`;
  }

  // Status label
  const statusLabel =
    status === "pending"
      ? "Tap to play"
      : status === "completed"
      ? "View results"
      : status === "active" && isSender
      ? "Waiting for responses"
      : "Start challenge";

  const statusColor =
    status === "pending"
      ? "text-neon-cyan"
      : status === "completed"
      ? "text-neon-purple"
      : "text-white/40";

  return (
    <Link
      href={href}
      className="glass group block rounded-2xl p-4 transition-all hover:bg-white/10 active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        {/* Question emoji */}
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-2xl">
          {question.emoji}
        </span>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-white">
              {question.title}
            </h3>
            <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/40">
              {playModeLabels[playMode] || playMode}
            </span>
          </div>

          {senderName && status !== "saved" && (
            <p className="mt-0.5 truncate text-xs text-white/40">
              {isSender ? `Sent to friends` : `From ${senderName}`}
            </p>
          )}

          <p className={`mt-1 text-xs font-medium ${statusColor}`}>
            {statusLabel}
          </p>
        </div>

        {/* Vibe gauge for completed */}
        {status === "completed" && vibeLevel && (
          <div className="shrink-0">
            <VibeGauge vibeLevel={vibeLevel} size="normal" />
          </div>
        )}

        {/* Arrow for actionable items */}
        {(status === "pending" || status === "saved") && (
          <span className="shrink-0 self-center text-white/20">→</span>
        )}
      </div>
    </Link>
  );
}
