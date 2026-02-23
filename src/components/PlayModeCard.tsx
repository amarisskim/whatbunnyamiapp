"use client";

import { PlayMode } from "@/types";

interface PlayModeInfo {
  mode: PlayMode;
  title: string;
  description: string;
  emoji: string;
  players: string;
}

export const playModeInfos: PlayModeInfo[] = [
  {
    mode: "solo",
    title: "Just Me",
    description: "Pick your favorite — no friends needed",
    emoji: "💖",
    players: "1 player",
  },
  {
    mode: "compare",
    title: "Compare Picks",
    description: "Both pick, then see if you chose the same thing",
    emoji: "🔀",
    players: "2 players",
  },
  {
    mode: "guess-my-pick",
    title: "Guess My Pick",
    description: "You pick, they guess what you chose",
    emoji: "🧠",
    players: "2 players",
  },
  {
    mode: "two-player-guess",
    title: "Both Guess",
    description: "Both answer the same question, then compare",
    emoji: "🔮",
    players: "2 players",
  },
];

interface PlayModeCardProps {
  info: PlayModeInfo;
  onStart: () => void;
  onSave?: () => void;
  saved?: boolean;
  disabled?: boolean;
}

export default function PlayModeCard({
  info,
  onStart,
  onSave,
  saved = false,
  disabled = false,
}: PlayModeCardProps) {
  return (
    <div className="glass rounded-2xl p-4 transition-all">
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-2xl">
          {info.emoji}
        </span>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{info.title}</h3>
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/40">
              {info.players}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-white/50">{info.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={onStart}
          disabled={disabled}
          className="flex-1 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-2.5 text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          Start
        </button>
        {onSave && (
          <button
            onClick={onSave}
            className={`rounded-full px-4 py-2.5 text-xs font-bold transition-all ${
              saved
                ? "bg-neon-cyan/10 text-neon-cyan"
                : "bg-white/[0.06] text-white/40 hover:text-white/60"
            }`}
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}

export function getPlayModesForQuestion(nature: "choose" | "guess"): PlayModeInfo[] {
  if (nature === "choose") {
    return playModeInfos.filter((m) =>
      ["solo", "compare", "guess-my-pick"].includes(m.mode)
    );
  }
  // guess questions: only two-player-guess
  return playModeInfos.filter((m) => m.mode === "two-player-guess");
}
