"use client";

interface ProgressDotsProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressDots({ steps, currentStep }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map((label, index) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-neon-cyan neon-glow-cyan scale-125"
                  : index < currentStep
                  ? "bg-neon-cyan/60"
                  : "bg-white/20"
              }`}
            />
            <span
              className={`text-[10px] font-medium transition-colors ${
                index === currentStep ? "text-neon-cyan" : "text-white/40"
              }`}
            >
              {label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-px w-8 transition-colors ${
                index < currentStep ? "bg-neon-cyan/40" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
