"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/auth";
import {
  getMySentChallenges,
  getReceivedChallenges,
  getSavedChallenges,
} from "@/lib/api/challenges";
import {
  Challenge,
  ChallengeRecipient,
  SavedChallenge,
} from "@/types";
import Header from "@/components/Header";
import ChallengeCard from "@/components/ChallengeCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

type Tab = "active" | "completed" | "saved";

export default function MyLibraryPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [sentChallenges, setSentChallenges] = useState<Challenge[]>([]);
  const [receivedChallenges, setReceivedChallenges] = useState<
    (ChallengeRecipient & { challenge: Challenge })[]
  >([]);
  const [savedChallenges, setSavedChallenges] = useState<SavedChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;
    const [sent, received, saved] = await Promise.all([
      getMySentChallenges(user.id),
      getReceivedChallenges(user.id),
      getSavedChallenges(user.id),
    ]);
    setSentChallenges(sent);
    setReceivedChallenges(received);
    setSavedChallenges(saved);
    setLoading(false);
  }

  // Split received into pending (active) and completed
  const pendingReceived = receivedChallenges.filter(
    (r) => r.status === "pending"
  );
  const completedReceived = receivedChallenges.filter(
    (r) => r.status === "completed"
  );

  // Active = pending received + active sent
  const activeSent = sentChallenges.filter((c) => c.status === "active");

  // Completed = completed received + completed sent
  const completedSent = sentChallenges.filter((c) => c.status === "completed");

  const tabs: { key: Tab; label: string; count: number }[] = [
    {
      key: "active",
      label: "Active",
      count: pendingReceived.length + activeSent.length,
    },
    {
      key: "completed",
      label: "Completed",
      count: completedReceived.length + completedSent.length,
    },
    { key: "saved", label: "Saved", count: savedChallenges.length },
  ];

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background pb-24">
      <Header title="My Vibes" />

      <div className="px-4 pt-16">
        {/* Tab bar */}
        <div className="mb-6 flex gap-1 rounded-xl bg-white/[0.04] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
                    activeTab === tab.key
                      ? tab.key === "active"
                        ? "bg-neon-cyan/20 text-neon-cyan"
                        : "bg-neon-purple/20 text-neon-purple"
                      : "bg-white/[0.06] text-white/30"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active tab */}
        {activeTab === "active" && (
          <div className="flex flex-col gap-3 animate-fade-in">
            {/* Pending challenges from friends */}
            {pendingReceived.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">
                  From friends
                </p>
                <div className="flex flex-col gap-2">
                  {pendingReceived.map((r) => (
                    <ChallengeCard
                      key={r.id}
                      id={r.challenge_id}
                      questionId={r.challenge?.question_id || ""}
                      playMode={r.challenge?.play_mode || "solo"}
                      senderName={
                        r.challenge?.sender?.display_name || "Friend"
                      }
                      status="pending"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Challenges I sent (waiting for responses) */}
            {activeSent.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">
                  Sent by you
                </p>
                <div className="flex flex-col gap-2">
                  {activeSent.map((c) => (
                    <ChallengeCard
                      key={c.id}
                      id={c.id}
                      questionId={c.question_id}
                      playMode={c.play_mode}
                      status="active"
                      isSender
                    />
                  ))}
                </div>
              </div>
            )}

            {pendingReceived.length === 0 && activeSent.length === 0 && (
              <EmptyState
                emoji="📭"
                title="No active challenges"
                description="Start a new challenge from the Library or wait for friends to send you one!"
                action={
                  <Link
                    href="/library"
                    className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-2.5 text-sm font-bold text-white"
                  >
                    Browse Library
                  </Link>
                }
              />
            )}
          </div>
        )}

        {/* Completed tab */}
        {activeTab === "completed" && (
          <div className="flex flex-col gap-3 animate-fade-in">
            {/* Completed received */}
            {completedReceived.map((r) => {
              const responses = r.challenge?.responses || [];
              const myResp = responses.find(
                (resp) => resp.responder_id === user?.id
              );
              return (
                <ChallengeCard
                  key={r.id}
                  id={r.challenge_id}
                  questionId={r.challenge?.question_id || ""}
                  playMode={r.challenge?.play_mode || "solo"}
                  senderName={r.challenge?.sender?.display_name || "Friend"}
                  status="completed"
                  resultType={myResp?.result_type}
                  vibeLevel={myResp?.vibe_level}
                />
              );
            })}

            {/* Completed sent */}
            {completedSent.map((c) => {
              const firstResp = c.responses?.[0];
              return (
                <ChallengeCard
                  key={c.id}
                  id={c.id}
                  questionId={c.question_id}
                  playMode={c.play_mode}
                  status="completed"
                  resultType={firstResp?.result_type}
                  vibeLevel={firstResp?.vibe_level}
                  isSender
                />
              );
            })}

            {completedReceived.length === 0 && completedSent.length === 0 && (
              <EmptyState
                emoji="🏁"
                title="No completed challenges yet"
                description="Complete a challenge to see your results here!"
              />
            )}
          </div>
        )}

        {/* Saved tab */}
        {activeTab === "saved" && (
          <div className="flex flex-col gap-3 animate-fade-in">
            {savedChallenges.map((s) => (
              <ChallengeCard
                key={s.id}
                id={s.id}
                questionId={s.question_id}
                playMode="solo"
                status="saved"
              />
            ))}

            {savedChallenges.length === 0 && (
              <EmptyState
                emoji="🔖"
                title="No saved challenges"
                description="Save challenges from the Library to find them easily later!"
                action={
                  <Link
                    href="/library"
                    className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-2.5 text-sm font-bold text-white"
                  >
                    Browse Library
                  </Link>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
