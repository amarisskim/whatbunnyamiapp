"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { signInWithGoogle } from "@/lib/auth";

function SignupContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const invite = searchParams.get("invite");
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignUp() {
    setLoading(true);
    try {
      // If there's an invite code, include it in the redirect URL
      // so we can process it after signup
      let redirectPath = redirect;
      if (invite) {
        redirectPath = `/invite/${invite}`;
      }
      await signInWithGoogle(redirectPath);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
      {/* Logo / Brand */}
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-5xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            VibeCheck
          </span>
        </h1>
        <p className="mt-3 text-sm text-white/50">
          pick your vibes. challenge your friends.
        </p>
      </div>

      {/* Sign Up Card */}
      <div className="w-full max-w-sm animate-slide-up">
        <div className="glass rounded-3xl p-8">
          <h2 className="mb-2 text-center text-xl font-bold text-white">
            {invite ? "You're invited!" : "Join VibeCheck"}
          </h2>
          <p className="mb-8 text-center text-sm text-white/40">
            {invite
              ? "Sign up to connect with your friend"
              : "Create an account to start vibing"}
          </p>

          {invite && (
            <div className="mb-6 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 px-4 py-3 text-center">
              <p className="text-xs text-neon-cyan/60 uppercase tracking-wider mb-1">
                Friend invite
              </p>
              <p className="text-sm text-white/70">
                You&apos;ll be automatically connected after signing up
              </p>
            </div>
          )}

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {loading ? "Creating account..." : "Sign up with Google"}
          </button>
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-white/30">
          Already have an account?{" "}
          <a href="/login" className="text-neon-cyan hover:underline">
            Sign in
          </a>
        </p>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-neon-purple/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-neon-cyan/5 blur-3xl" />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
