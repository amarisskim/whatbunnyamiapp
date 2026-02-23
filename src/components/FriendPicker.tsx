"use client";

import Image from "next/image";
import { Profile } from "@/types";

export default function FriendPicker({
  friends,
  selected,
  onToggle,
}: {
  friends: Profile[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {friends.map((friend) => {
        const isSelected = selected.has(friend.id);
        return (
          <button
            key={friend.id}
            onClick={() => onToggle(friend.id)}
            className={`flex items-center gap-3 rounded-2xl p-4 transition-all active:scale-[0.98] ${
              isSelected
                ? "bg-neon-cyan/10 ring-2 ring-neon-cyan/50"
                : "glass hover:bg-white/[0.08]"
            }`}
          >
            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
              {friend.avatar_url ? (
                <Image
                  src={friend.avatar_url}
                  alt={friend.display_name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white/60">
                  {friend.display_name.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>

            {/* Name */}
            <span className="flex-1 text-left text-sm font-semibold text-white truncate">
              {friend.display_name || "Anonymous"}
            </span>

            {/* Checkbox */}
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                isSelected
                  ? "border-neon-cyan bg-neon-cyan text-black"
                  : "border-white/20"
              }`}
            >
              {isSelected && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
