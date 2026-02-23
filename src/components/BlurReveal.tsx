"use client";

interface BlurRevealProps {
  isRevealed: boolean;
  children: React.ReactNode;
}

export default function BlurReveal({ isRevealed, children }: BlurRevealProps) {
  return (
    <div className="relative">
      {/* The actual content */}
      <div
        className={`transition-all duration-700 ease-out ${
          isRevealed ? "blur-0 scale-100" : "blur-lg scale-[0.98]"
        }`}
      >
        {children}
      </div>

      {/* Overlay when not revealed */}
      {!isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[20px]">
          <div className="glass-strong rounded-full px-4 py-2 animate-pulse-glow">
            <span className="text-xs font-bold text-white/80">
              🔒 Submit to reveal
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
