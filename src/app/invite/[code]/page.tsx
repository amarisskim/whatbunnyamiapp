"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getProfileByInviteCode, addFriend } from "@/lib/api/friends";
import { Profile } from "@/types";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [status, setStatus] = useState<
    "loading" | "processing" | "success" | "error" | "self" | "not-found"
  >("loading");
  const [inviter, setInviter] = useState<Profile | null>(null);

  useEffect(() => {
    handleInvite();
  }, [code]);

  async function handleInvite() {
    // Look up who sent the invite
    const inviterProfile = await getProfileByInviteCode(code);
    if (!inviterProfile) {
      setStatus("not-found");
      return;
    }
    setInviter(inviterProfile);

    // Check if user is logged in
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Not logged in — redirect to signup with invite code
      router.replace(`/signup?invite=${code}`);
      return;
    }

    // Don't friend yourself
    if (user.id === inviterProfile.id) {
      setStatus("self");
      return;
    }

    // Logged in — add as friend
    setStatus("processing");
    const success = await addFriend(user.id, inviterProfile.id);

    if (success) {
      setStatus("success");
      // Redirect to friends page after a moment
      setTimeout(() => router.replace("/friends"), 2000);
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm text-center animate-fade-in">
        {status === "loading" && (
          <>
            <div className="mb-4 h-10 w-10 mx-auto animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
            <p className="text-sm text-white/50">Processing invite...</p>
          </>
        )}

        {status === "processing" && (
          <>
            <div className="mb-4 h-10 w-10 mx-auto animate-spin rounded-full border-2 border-neon-purple border-t-transparent" />
            <p className="text-sm text-white/50">
              Adding {inviter?.display_name || "friend"}...
            </p>
          </>
        )}

        {status === "success" && (
          <div className="glass rounded-3xl p-8">
            <span className="text-5xl block mb-4">🎉</span>
            <h2 className="text-xl font-bold text-white mb-2">You&apos;re connected!</h2>
            <p className="text-sm text-white/50">
              You and{" "}
              <span className="text-neon-cyan font-semibold">
                {inviter?.display_name || "your friend"}
              </span>{" "}
              are now friends on VibeCheck
            </p>
            <p className="mt-4 text-xs text-white/30">
              Redirecting to friends...
            </p>
          </div>
        )}

        {status === "self" && (
          <div className="glass rounded-3xl p-8">
            <span className="text-5xl block mb-4">😅</span>
            <h2 className="text-xl font-bold text-white mb-2">
              That&apos;s your own link!
            </h2>
            <p className="text-sm text-white/50 mb-6">
              Share this link with someone else to add them as a friend.
            </p>
            <a
              href="/friends"
              className="inline-block rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-2.5 text-sm font-bold text-white"
            >
              Go to Friends
            </a>
          </div>
        )}

        {status === "not-found" && (
          <div className="glass rounded-3xl p-8">
            <span className="text-5xl block mb-4">❌</span>
            <h2 className="text-xl font-bold text-white mb-2">
              Invalid invite link
            </h2>
            <p className="text-sm text-white/50 mb-6">
              This invite link doesn&apos;t exist or has expired.
            </p>
            <a
              href="/"
              className="inline-block rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-2.5 text-sm font-bold text-white"
            >
              Go Home
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="glass rounded-3xl p-8">
            <span className="text-5xl block mb-4">😕</span>
            <h2 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-white/50 mb-6">
              Couldn&apos;t process the invite. You might already be friends!
            </p>
            <a
              href="/friends"
              className="inline-block rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-2.5 text-sm font-bold text-white"
            >
              Check Friends
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
