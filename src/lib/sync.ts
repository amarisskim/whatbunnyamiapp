import { Question, ResultType, VibeLevel } from "@/types";

// For guess-my-pick: did the recipient guess the sender's pick correctly?
export function calculateGuessResult(
  senderOptionId: string,
  responderGuessId: string
): ResultType {
  return senderOptionId === responderGuessId ? "correct" : "wrong";
}

// For compare / two-player-guess: did both players pick the same thing?
export function calculateCompareResult(
  senderOptionId: string,
  responderOptionId: string
): ResultType {
  return senderOptionId === responderOptionId ? "match" : "different";
}

// 3-tier vibe gauge: soulmates > same-wavelength > beautifully-different
export function calculateVibeLevel(
  senderOptionId: string,
  responderOptionOrGuessId: string,
  question: Question
): VibeLevel {
  // Exact same pick = soulmates
  if (senderOptionId === responderOptionOrGuessId) {
    return "soulmates";
  }

  // Check for shared tags between the two options
  const senderOption = question.options.find((o) => o.id === senderOptionId);
  const responderOption = question.options.find(
    (o) => o.id === responderOptionOrGuessId
  );

  if (senderOption && responderOption) {
    const sharedTags = senderOption.tags.filter((tag) =>
      responderOption.tags.includes(tag)
    );
    if (sharedTags.length > 0) {
      return "same-wavelength";
    }
  }

  return "beautifully-different";
}

// Vibe level display info
export function getVibeLevelInfo(level: VibeLevel): {
  label: string;
  emoji: string;
  message: string;
  color: string;
} {
  switch (level) {
    case "soulmates":
      return {
        label: "Soulmates",
        emoji: "💕",
        message: "You're in their head!",
        color: "#ff6b9d", // neon-pink
      };
    case "same-wavelength":
      return {
        label: "Same Wavelength",
        emoji: "✨",
        message: "Great minds think alike",
        color: "#00e5ff", // neon-cyan
      };
    case "beautifully-different":
      return {
        label: "Beautifully Different",
        emoji: "🌈",
        message: "Opposites attract!",
        color: "#bf5af2", // neon-purple
      };
  }
}

// Legacy display helpers (still used by ResultBadge until replaced)
export function getResultColor(result: ResultType): string {
  switch (result) {
    case "correct":
    case "match":
      return "#06d6a0"; // green
    case "wrong":
    case "different":
      return "#ef476f"; // pink/red
  }
}

export function getResultLabel(result: ResultType): string {
  switch (result) {
    case "correct":
      return "Correct!";
    case "wrong":
      return "Wrong!";
    case "match":
      return "You matched!";
    case "different":
      return "Different picks!";
  }
}

export function getResultEmoji(result: ResultType): string {
  switch (result) {
    case "correct":
      return "🧠";
    case "wrong":
      return "😅";
    case "match":
      return "✨";
    case "different":
      return "🫣";
  }
}

export function getResultMessage(result: ResultType): string {
  switch (result) {
    case "correct":
      return "You read them like a book! 🧠✨";
    case "wrong":
      return "Not quite — but now you know! 😅";
    case "match":
      return "Same wavelength! You both picked the same thing! ✨";
    case "different":
      return "Different vibes — opposites attract? 🫣";
  }
}
