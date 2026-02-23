"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/auth";
import {
  getChallengeById,
  getResponse,
  getChallengeResponses,
} from "@/lib/api/challenges";
import { getQuestionById } from "@/data/questions";
import { calculateVibeLevel } from "@/lib/sync";
import {
  Challenge,
  ChallengeResponse as ChallengeResponseType,
  Question,
  QuestionOption,
  VibeLevel,
} from "@/types";
import Header from "@/components/Header";
import MediaCard from "@/components/MediaCard";
import VibeGauge from "@/components/VibeGauge";
import BlurReveal from "@/components/BlurReveal";
import SwapButton from "@/components/SwapButton";
import ConfettiOverlay from "@/components/ConfettiOverlay";
import ShareButton from "@/components/ShareButton";
import InstantShareModal from "@/components/InstantShareModal";

export default function ChallengeResultsPage() {
  const params = useParams();
  const { user } = useUser();
  const challengeId = params.challengeId as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [myResponse, setMyResponse] = useState<ChallengeResponseType | null>(
    null
  );
  const [allResponses, setAllResponses] = useState<ChallengeResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  const isSender = challenge?.sender_id === user?.id;

  useEffect(() => {
    if (!user) return;
    loadResults();
  }, [user, challengeId]);

  async function loadResults() {
    const challengeData = await getChallengeById(challengeId);
    setChallenge(challengeData);

    if (challengeData) {
      const q = getQuestionById(challengeData.question_id);
      setQuestion(q || null);

      const [response, responses] = await Promise.all([
        getResponse(challengeId, user!.id),
        getChallengeResponses(challengeId),
      ]);
      setMyResponse(response);
      setAllResponses(responses);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
      </div>
    );
  }

  if (!challenge || !question) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-white/50">
        Challenge not found
      </div>
    );
  }

  const senderName = challenge.sender?.display_name || "Friend";
  const playMode = challenge.play_mode;

  // Helper: find option by id
  function findOption(optionId: string | null): QuestionOption | undefined {
    if (!optionId || !question) return undefined;
    return question.options.find((o) => o.id === optionId);
  }

  const senderOption = findOption(challenge.sender_option_id);

  // Determine which response to show
  const responseToShow = isSender ? allResponses[0] : myResponse;

  const responderOption = findOption(
    responseToShow?.responder_option_id || null
  );
  const responderGuess = findOption(
    responseToShow?.responder_guess_id || null
  );

  // Calculate vibe level
  const hasResponse = !!responseToShow;
  let vibeLevel: VibeLevel | null = null;

  if (hasResponse && challenge.sender_option_id && question) {
    // Use stored vibe_level if available, otherwise calculate
    if (responseToShow?.vibe_level) {
      vibeLevel = responseToShow.vibe_level as VibeLevel;
    } else {
      const responderPick =
        responseToShow?.responder_guess_id ||
        responseToShow?.responder_option_id;
      if (responderPick) {
        vibeLevel = calculateVibeLevel(
          challenge.sender_option_id,
          responderPick,
          question
        );
      }
    }
  }

  const showConfetti = vibeLevel === "soulmates";

  // ============================================================
  // SOLO MODE — just show what they picked + option to share
  // ============================================================
  if (playMode === "solo") {
    const myOption = findOption(
      myResponse?.responder_option_id || challenge.sender_option_id
    );

    return (
      <div className="min-h-dvh bg-background pb-8">
        <Header title={`${question.emoji} Your Pick`} />

        <div className="px-4 pt-16">
          <div className="mb-8 text-center animate-fade-in-scale">
            <span className="text-5xl block mb-3">{question.emoji}</span>
            <h2 className="text-2xl font-bold text-white mb-1">
              {question.title}
            </h2>
            <p className="text-sm text-white/50">{question.prompt}</p>
          </div>

          {myOption && (
            <div className="mb-8 animate-fade-in">
              <p className="mb-2 text-xs font-medium text-white/40 text-center">
                You picked
              </p>
              <div className="mx-auto w-48">
                <MediaCard item={myOption} size="small" />
              </div>
              <p className="mt-3 text-center text-lg font-bold text-white">
                {myOption.title}
              </p>
            </div>
          )}

          {/* Challenge a friend from solo results */}
          <div className="mt-6 animate-fade-in">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span>📤</span>
              Challenge a Friend
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <a
              href="/library"
              className="block text-center rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-3 text-sm font-bold text-white"
            >
              Try Another Challenge
            </a>
            <a
              href="/my-library"
              className="block text-center rounded-full bg-white/[0.06] px-6 py-3 text-sm font-bold text-white/60 transition-all hover:bg-white/10"
            >
              My Library
            </a>
          </div>
        </div>

        {/* Share modal for challenging friends from solo mode */}
        <InstantShareModal
          isOpen={showShareModal}
          challengeId={challengeId}
          question={question}
          onClose={() => setShowShareModal(false)}
        />
      </div>
    );
  }

  // ============================================================
  // MULTIPLAYER RESULTS — compare, guess-my-pick, two-player-guess
  // ============================================================

  return (
    <div className="min-h-dvh bg-background pb-8">
      {showConfetti && <ConfettiOverlay />}
      <Header title={`${question.emoji} Results`} />

      <div className="px-4 pt-16">
        {/* Vibe Gauge (replaces ResultBadge) */}
        {vibeLevel && (
          <div className="mb-6 animate-fade-in-scale">
            <VibeGauge vibeLevel={vibeLevel} size="large" />
          </div>
        )}

        {/* Side by side picks with blur reveal */}
        <div className="mb-8 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            {/* Sender's pick — blurred for recipients until they respond */}
            {senderOption && (
              <div>
                <p className="mb-2 text-xs font-medium text-white/40 text-center">
                  {isSender ? "Your pick" : `${senderName}'s pick`}
                </p>
                <BlurReveal isRevealed={isSender || hasResponse}>
                  <MediaCard item={senderOption} size="small" />
                </BlurReveal>
                {(isSender || hasResponse) && (
                  <p className="mt-1 text-center text-xs font-medium text-white/60">
                    {senderOption.title}
                  </p>
                )}
              </div>
            )}

            {/* Responder's pick or guess */}
            {playMode === "guess-my-pick" && (responderGuess || responderOption) && (
              <div>
                <p className="mb-2 text-xs font-medium text-white/40 text-center">
                  {isSender
                    ? responseToShow?.responder
                      ? `${(responseToShow.responder as unknown as { display_name: string }).display_name}'s guess`
                      : "Their guess"
                    : "Your guess"}
                </p>
                <MediaCard
                  item={(responderGuess || responderOption)!}
                  size="small"
                />
                <p className="mt-1 text-center text-xs font-medium text-white/60">
                  {(responderGuess || responderOption)!.title}
                </p>
              </div>
            )}

            {(playMode === "compare" || playMode === "two-player-guess") &&
              responderOption && (
                <div>
                  <p className="mb-2 text-xs font-medium text-white/40 text-center">
                    {isSender
                      ? responseToShow?.responder
                        ? `${(responseToShow.responder as unknown as { display_name: string }).display_name}'s pick`
                        : "Their pick"
                      : "Your pick"}
                  </p>
                  <MediaCard item={responderOption} size="small" />
                  <p className="mt-1 text-center text-xs font-medium text-white/60">
                    {responderOption.title}
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* No response yet (sender viewing) */}
        {isSender && allResponses.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <span className="text-4xl block mb-3">⏳</span>
            <p className="text-lg font-bold text-white mb-1">
              Waiting for responses
            </p>
            <p className="text-sm text-white/40">
              Your friends haven&apos;t responded yet
            </p>
          </div>
        )}

        {/* All responses summary (sender sees multiple) */}
        {isSender && allResponses.length > 1 && (
          <div className="mb-6 animate-fade-in">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
              All responses
            </p>
            <div className="flex flex-col gap-2">
              {allResponses.map((r) => {
                const responderName =
                  (r.responder as unknown as { display_name: string })
                    ?.display_name || "Friend";
                const rVibeLevel = r.vibe_level as VibeLevel | null;
                return (
                  <div
                    key={r.id}
                    className="glass rounded-xl p-3 flex items-center gap-3"
                  >
                    <span className="text-sm font-bold text-white flex-1 truncate">
                      {responderName}
                    </span>
                    {rVibeLevel && <VibeGauge vibeLevel={rVibeLevel} size="normal" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Swap button — show to recipients who just completed */}
        {!isSender && hasResponse && user && (
          <div className="mb-4 animate-fade-in">
            <SwapButton
              originalChallengeId={challengeId}
              senderName={senderName}
              senderId={challenge.sender_id}
              questionId={challenge.question_id}
              playMode={playMode}
              currentUserId={user.id}
            />
          </div>
        )}

        {/* Share */}
        <div className="mt-4 animate-fade-in">
          <ShareButton
            url={`/challenge/${challengeId}/results`}
            title="VibeCheck Results"
            text={`Check out our vibe! ${
              vibeLevel === "soulmates"
                ? "We're soulmates! 💕"
                : vibeLevel === "same-wavelength"
                ? "Same wavelength! ✨"
                : ""
            }`}
          />
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-3">
          <a
            href="/my-library"
            className="block text-center rounded-full bg-white/[0.06] px-6 py-3 text-sm font-bold text-white/60 transition-all hover:bg-white/10"
          >
            Back to My Library
          </a>
          <a
            href="/library"
            className="block text-center rounded-full bg-white/[0.06] px-6 py-3 text-sm font-bold text-white/60 transition-all hover:bg-white/10"
          >
            Start New Challenge
          </a>
        </div>
      </div>
    </div>
  );
}
