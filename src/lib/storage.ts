const STORAGE_KEY = "vibecheck_picks";

export interface SavedPicks {
  [categoryId: string]: string;
}

export function savePick(categoryId: string, itemId: string): void {
  const existing = getPicks();
  existing[categoryId] = itemId;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}

export function getPicks(): SavedPicks {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getPick(categoryId: string): string | null {
  return getPicks()[categoryId] || null;
}

export function clearPicks(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
