"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function Header({
  title,
  showBack = true,
  rightAction,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="glass-strong fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-4">
      <div className="w-10">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white active:scale-95"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {title && (
        <h1 className="text-sm font-semibold tracking-wide text-white/80">
          {title}
        </h1>
      )}

      <div className="w-10 flex justify-end">{rightAction}</div>
    </header>
  );
}
