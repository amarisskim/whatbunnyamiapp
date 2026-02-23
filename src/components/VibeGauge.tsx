"use client";

import { VibeLevel } from "@/types";
import { getVibeLevelInfo } from "@/lib/sync";

interface VibeGaugeProps {
  vibeLevel: VibeLevel;
  size?: "normal" | "large";
}

export default function VibeGauge({
  vibeLevel,
  size = "normal",
}: VibeGaugeProps) {
  const info = getVibeLevelInfo(vibeLevel);

  const isLarge = size === "large";

  return (
    <div
      className={`animate-fade-in-scale text-center ${
        isLarge ? "py-6" : "py-2"
      }`}
    >
      {/* Glow effect */}
      <div
        className={`relative inline-flex flex-col items-center ${
          isLarge ? "gap-3" : "gap-1"
        }`}
      >
        {/* Emoji + glow ring */}
        <div className="relative">
          <div
            className={`rounded-full ${
              isLarge ? "text-5xl p-4" : "text-2xl p-2"
            }`}
            style={{
              boxShadow: `0 0 ${isLarge ? "40px" : "20px"} ${info.color}40`,
            }}
          >
            {info.emoji}
          </div>
          {/* Animated glow ring for soulmates */}
          {vibeLevel === "soulmates" && (
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                boxShadow: `0 0 20px ${info.color}60`,
                opacity: 0.3,
              }}
            />
          )}
        </div>

        {/* Label */}
        <h3
          className={`font-extrabold ${
            isLarge ? "text-2xl" : "text-sm"
          }`}
          style={{ color: info.color }}
        >
          {info.label}
        </h3>

        {/* Message */}
        <p
          className={`text-white/60 ${
            isLarge ? "text-base" : "text-xs"
          }`}
        >
          {info.message}
        </p>
      </div>
    </div>
  );
}
