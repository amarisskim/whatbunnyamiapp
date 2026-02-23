"use client";

import { useUser } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 mx-auto animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
          <p className="text-sm text-white/30">Loading your vibes...</p>
        </div>
      </div>
    );
  }

  // If not logged in, middleware should have redirected already.
  // This is a fallback for client-side navigation.
  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-4xl mb-3">🔒</p>
          <p className="text-lg font-bold text-white">Sign in required</p>
          <a
            href="/login"
            className="mt-4 inline-block rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-2.5 text-sm font-bold text-white"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
