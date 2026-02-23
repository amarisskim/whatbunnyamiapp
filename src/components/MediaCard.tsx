"use client";

import Image from "next/image";
import { QuestionOption } from "@/types";

interface MediaCardProps {
  item: QuestionOption;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  overlayLabel?: string;
  size?: "normal" | "small";
}

export default function MediaCard({
  item,
  selected = false,
  onSelect,
  disabled = false,
  overlayLabel,
  size = "normal",
}: MediaCardProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`group relative overflow-hidden rounded-[20px] transition-all duration-300 ${
        size === "small" ? "aspect-square" : "aspect-[3/4]"
      } ${
        selected
          ? "ring-2 ring-neon-cyan neon-glow-cyan scale-[0.97]"
          : "ring-1 ring-white/10 hover:ring-white/20 active:scale-[0.97]"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Image */}
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-neon-cyan text-black animate-fade-in-scale">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {/* Overlay label (e.g., "Pick yours", "Guess theirs") */}
      {overlayLabel && !selected && (
        <div className="absolute top-3 left-3 rounded-full glass px-3 py-1 text-xs font-medium text-white/80">
          {overlayLabel}
        </div>
      )}

      {/* Title at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-sm font-semibold text-white drop-shadow-lg">
          {item.title}
        </p>
      </div>
    </button>
  );
}
