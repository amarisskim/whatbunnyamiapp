import Image from "next/image";
import { Profile } from "@/types";

export default function FriendCard({ friend }: { friend: Profile }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-4 animate-fade-in">
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
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {friend.display_name || "Anonymous"}
        </p>
      </div>
    </div>
  );
}
