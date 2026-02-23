"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/auth";
import { getPendingChallengeCount } from "@/lib/api/challenges";

export default function InboxBadge() {
  const { user } = useUser();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    getPendingChallengeCount(user.id).then(setCount);

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      getPendingChallengeCount(user.id).then(setCount);
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neon-pink px-1 text-[9px] font-bold text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
