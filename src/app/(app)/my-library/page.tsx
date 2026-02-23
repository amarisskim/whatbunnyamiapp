"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/auth";
import {
  getMySentChallenges,
  getReceivedChallenges,
  getSavedChallenges,
} from "@/lib/api/challenges";
import { getQuestionById } from "@/data/questions";
import {
  Challenge,
  ChallengeRecipient,
  SavedChallenge,
  PlayMode,
} from "@/types";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";

type Tab = "active" | "completed" | "saved";

const playModeIcons: Record<PlayMode, string> = {
  solo: "💖",
  compare: "🤝",
  "guess-my-pick": "🔮",
  "two-player-guess": "🧠",
};

// Gradient colors for the colored cards (no image)
const cardGradients = [
  "from-neon-cyan/30 to-neon-purple/30",
  "from-neon-pink/30 to-neon-purple/30",
  "from-neon-purple/30 to-neon-cyan/30",
  "from-neon-cyan/30 to-neon-pink/30",
  "from-neon-pink/30 to-neon-cyan/30",
  "from-neon-purple/30 to-neon-pink/30",
];

interface CompletedResult {
  challengeId: string;
  questionTitle: string;
  questionEmoji: string;
  playMode: PlayMode;
  pickedOptionTitle: string;
  pickedOptionImageUrl: string;
}

interface ActiveItem {
  id: string;
  questionId: string;
  questionTitle: string;
  questionEmoji: string;
  playMode: PlayMode;
  href: string;
  label: string; // e.g. "Tap to play" or "Waiting..."
  senderName?: string;
}

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
  const completedReceived = receivedChallenges.filter(
    (r) => r.status === "completed"
  );

  const completedSent = sentChallenges.filter((c) => c.status === "completed");

  // Build a set of question IDs that the user has already completed
  // (either as sender or recipient) to filter them out of the active tab
  const completedQuestionIds = new Set<string>();
  completedSent.forEach((c) => completedQuestionIds.add(c.question_id));
  completedReceived.forEach((r) => {
    if (r.challenge?.question_id) {
      completedQuestionIds.add(r.challenge.question_id);
    }
  });

  // Filter active sent challenges: exclude any where the user already
  // completed that same question (e.g. they replayed from library but didn't finish)
  const activeSent = sentChallenges.filter(
    (c) => c.status === "active" && !completedQuestionIds.has(c.question_id)
  );

  // Also filter pending received challenges the same way
  const pendingReceived = receivedChallenges.filter(
    (r) =>
      r.status === "pending" &&
      !completedQuestionIds.has(r.challenge?.question_id || "")
  );

  // --- Build active items ---
  const activeItems: ActiveItem[] = [];

  pendingReceived.forEach((r) => {
    const question = getQuestionById(r.challenge?.question_id || "");
    if (!question) return;
    activeItems.push({
      id: r.id,
      questionId: question.id,
      questionTitle: question.title,
      questionEmoji: question.emoji,
      playMode: r.challenge?.play_mode || "solo",
      href: `/challenge/${r.challenge_id}/play`,
      label: `From ${r.challenge?.sender?.display_name || "Friend"}`,
      senderName: r.challenge?.sender?.display_name || "Friend",
    });
  });

  activeSent.forEach((c) => {
    const question = getQuestionById(c.question_id);
    if (!question) return;
    activeItems.push({
      id: c.id,
      questionId: question.id,
      questionTitle: question.title,
      questionEmoji: question.emoji,
      playMode: c.play_mode,
      href: `/challenge/${c.id}/results`,
      label: "Waiting for responses",
    });
  });

  // --- Build completed results ---
  const completedResults: CompletedResult[] = [];

  completedSent.forEach((c) => {
    const question = getQuestionById(c.question_id);
    if (!question) return;
    const myOptionId =
      c.sender_option_id ||
      c.responses?.find((r) => r.responder_id === user?.id)
        ?.responder_option_id;
    const pickedOption = question.options.find((o) => o.id === myOptionId);
    if (!pickedOption) return;
    completedResults.push({
      challengeId: c.id,
      questionTitle: question.title,
      questionEmoji: question.emoji,
      playMode: c.play_mode,
      pickedOptionTitle: pickedOption.title,
      pickedOptionImageUrl: pickedOption.imageUrl,
    });
  });

  completedReceived.forEach((r) => {
    const challenge = r.challenge;
    if (!challenge) return;
    const question = getQuestionById(challenge.question_id);
    if (!question) return;
    const myResp = challenge.responses?.find(
      (resp) => resp.responder_id === user?.id
    );
    const myOptionId =
      myResp?.responder_option_id || myResp?.responder_guess_id;
    const pickedOption = question.options.find((o) => o.id === myOptionId);
    if (!pickedOption) return;
    completedResults.push({
      challengeId: r.challenge_id,
      questionTitle: question.title,
      questionEmoji: question.emoji,
      playMode: challenge.play_mode,
      pickedOptionTitle: pickedOption.title,
      pickedOptionImageUrl: pickedOption.imageUrl,
    });
  });

  // --- Build saved items (exclude already-completed questions) ---
  const savedItems = savedChallenges
    .filter((s) => !completedQuestionIds.has(s.question_id))
    .map((s) => {
      const question = getQuestionById(s.question_id);
      if (!question) return null;
      return {
        id: s.id,
        questionId: s.question_id,
        questionTitle: question.title,
        questionEmoji: question.emoji,
        href: `/library/${s.question_id}`,
      };
    })
    .filter(Boolean) as {
    id: string;
    questionId: string;
    questionTitle: string;
    questionEmoji: string;
    href: string;
  }[];

  const tabs: { key: Tab; label: string; count: number }[] = [
    {
      key: "active",
      label: "Active",
      count: activeItems.length,
    },
    {
      key: "completed",
      label: "Completed",
      count: completedResults.length,
    },
    { key: "saved", label: "Saved", count: savedItems.length },
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

        {/* Active tab — colored cards grid */}
        {activeTab === "active" && (
          <div className="animate-fade-in">
            {activeItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {activeItems.map((item, i) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group relative aspect-square overflow-hidden rounded-2xl transition-all active:scale-[0.97]"
                  >
                    {/* Gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        cardGradients[i % cardGradients.length]
                      }`}
                    />

                    {/* Content */}
                    <div className="relative flex h-full flex-col items-center justify-center p-4">
                      <span className="text-4xl mb-2">{item.questionEmoji}</span>
                      <h3 className="text-center text-sm font-bold text-white leading-tight">
                        {item.questionTitle}
                      </h3>
                    </div>

                    {/* Top — mode icon */}
                    <div className="absolute top-3 left-3">
                      <span className="text-sm">
                        {playModeIcons[item.playMode]}
                      </span>
                    </div>

                    {/* Bottom — status label */}
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-center text-[11px] font-medium text-white/50">
                        {item.label}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
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

        {/* Completed tab — image grid of results */}
        {activeTab === "completed" && (
          <div className="animate-fade-in">
            {completedResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {completedResults.map((result) => (
                  <Link
                    key={result.challengeId}
                    href={`/challenge/${result.challengeId}/results`}
                    className="group relative aspect-square overflow-hidden rounded-2xl transition-all active:scale-[0.97]"
                  >
                    <Image
                      src={result.pickedOptionImageUrl}
                      alt={result.pickedOptionTitle}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                    <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">
                          {playModeIcons[result.playMode]}
                        </span>
                        <span className="truncate text-xs font-bold text-white drop-shadow-lg">
                          {result.questionTitle}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                      <p className="truncate text-xs font-medium text-white/80 drop-shadow-lg">
                        {result.pickedOptionTitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                emoji="🏁"
                title="No completed challenges yet"
                description="Complete a challenge to see your results here!"
              />
            )}
          </div>
        )}

        {/* Saved tab — colored cards grid */}
        {activeTab === "saved" && (
          <div className="animate-fade-in">
            {savedItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {savedItems.map((item, i) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group relative aspect-square overflow-hidden rounded-2xl transition-all active:scale-[0.97]"
                  >
                    {/* Gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        cardGradients[i % cardGradients.length]
                      }`}
                    />

                    {/* Content */}
                    <div className="relative flex h-full flex-col items-center justify-center p-4">
                      <span className="text-4xl mb-2">{item.questionEmoji}</span>
                      <h3 className="text-center text-sm font-bold text-white leading-tight">
                        {item.questionTitle}
                      </h3>
                    </div>

                    {/* Bottom — saved label */}
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-center text-[11px] font-medium text-white/50">
                        🔖 Saved
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
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
