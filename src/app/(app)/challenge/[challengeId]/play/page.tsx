"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import {
  getChallengeById,
  updateSenderOption,
  respondToChallenge,
  joinChallenge,
} from "@/lib/api/challenges";
import { getQuestionById } from "@/data/questions";
import {
  calculateGuessResult,
  calculateCompareResult,
  calculateVibeLevel,
} from "@/lib/sync";
import { Challenge, Question } from "@/types";
import Header from "@/components/Header";
import MediaCard from "@/components/MediaCard";
import InstantShareModal from "@/components/InstantShareModal";

export default function ChallengePlayPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const challengeId = params.challengeId as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [myPickId, setMyPickId] = useState<string | null>(null);
  const [myGuessId, setMyGuessId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const isSender = challenge?.sender_id === user?.id;

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  async function loadChallenge() {
    const data = await getChallengeById(challengeId);
    setChallenge(data);
    if (data) {
      const q = getQuestionById(data.question_id);
      setQuestion(q || null);

      // Auto-join as recipient if not the sender
      if (user && data.sender_id !== user.id) {
        await joinChallenge(challengeId, user.id);
      }
    }
    setLoading(false);
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
      </div>
    );
  }

  if (!challenge || !question) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-4xl mb-3">❌</p>
          <p className="text-lg font-bold text-white">Challenge not found</p>
          <a
            href="/library"
            className="mt-4 inline-block rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-2.5 text-sm font-bold text-white"
          >
            Browse Library
          </a>
        </div>
      </div>
    );
  }

  const playMode = challenge.play_mode;
  const senderName = challenge.sender?.display_name || "your friend";

  // ============================================================
  // SOLO MODE — sender picks, sees their pick, done (no sending)
  // ============================================================
  if (playMode === "solo") {
    async function handleSoloPick() {
      if (!myPickId) return;
      setSubmitting(true);

      await updateSenderOption(challengeId, myPickId);

      // Solo mode: respond to own challenge immediately
      await respondToChallenge({
        challengeId,
        responderId: user!.id,
        responderOptionId: myPickId,
      });

      router.push(`/challenge/${challengeId}/results`);
      setSubmitting(false);
    }

    return (
      <div className="min-h-dvh bg-background pb-8">
        <Header title={`${question.emoji} ${question.title}`} />

        <div className="px-4 pt-16">
          <div className="mb-6 text-center animate-fade-in">
            <p className="text-xs font-medium uppercase tracking-widest text-neon-cyan">
              Solo
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              {question.prompt}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              {question.options.length} options
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {question.options.map((option) => (
              <MediaCard
                key={option.id}
                item={option}
                selected={myPickId === option.id}
                onSelect={() =>
                  setMyPickId(myPickId === option.id ? null : option.id)
                }
              />
            ))}
          </div>

          {myPickId && (
            <button
              onClick={handleSoloPick}
              disabled={submitting}
              className="w-full animate-slide-up rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "See My Pick ✨"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // SENDER FLOW — for compare, guess-my-pick, two-player-guess
  // Shows InstantShareModal instead of redirecting to send page
  // ============================================================
  if (isSender && !challenge.sender_option_id) {
    async function handleSenderPick() {
      if (!myPickId) return;
      setSubmitting(true);

      const success = await updateSenderOption(challengeId, myPickId);

      if (success) {
        // Show the share modal right here instead of navigating to send page
        setShowShareModal(true);
      }
      setSubmitting(false);
    }

    const senderPrompt =
      playMode === "guess-my-pick"
        ? "Pick your answer — your friends will try to guess it!"
        : playMode === "compare"
        ? "Pick your favorite — then see if your friends match!"
        : question.prompt; // two-player-guess

    return (
      <div className="min-h-dvh bg-background pb-8">
        <Header title={`${question.emoji} ${question.title}`} />

        <div className="px-4 pt-16">
          <div className="mb-6 text-center animate-fade-in">
            <p className="text-xs font-medium uppercase tracking-widest text-neon-cyan">
              Your pick
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              {senderPrompt}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              {question.options.length} options
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {question.options.map((option) => (
              <MediaCard
                key={option.id}
                item={option}
                selected={myPickId === option.id}
                onSelect={() =>
                  setMyPickId(myPickId === option.id ? null : option.id)
                }
              />
            ))}
          </div>

          {myPickId && !showShareModal && (
            <button
              onClick={handleSenderPick}
              disabled={submitting}
              className="w-full animate-slide-up rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Lock it in 🔒"}
            </button>
          )}
        </div>

        {/* Instant share modal */}
        <InstantShareModal
          isOpen={showShareModal}
          challengeId={challengeId}
          question={question}
          onClose={() => setShowShareModal(false)}
        />
      </div>
    );
  }

  // Sender already picked — show the share modal again
  if (isSender && challenge.sender_option_id) {
    return (
      <div className="min-h-dvh bg-background pb-8">
        <Header title={`${question.emoji} ${question.title}`} />
        <div className="px-4 pt-20 text-center">
          <p className="text-4xl mb-3">{question.emoji}</p>
          <h2 className="text-xl font-bold text-white">
            You already locked in!
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Share the challenge link with friends
          </p>
          <button
            onClick={() => setShowShareModal(true)}
            className="mt-6 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
          >
            📤 Share Challenge
          </button>
        </div>

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
  // RECIPIENT FLOW — varies by play mode
  // ============================================================

  // --- GUESS-MY-PICK: recipient guesses what the sender picked ---
  if (playMode === "guess-my-pick") {
    async function handleGuessSubmit() {
      if (!myGuessId || !challenge?.sender_option_id || !question) return;
      setSubmitting(true);

      const result = calculateGuessResult(
        challenge.sender_option_id,
        myGuessId
      );
      const vibeLevel = calculateVibeLevel(
        challenge.sender_option_id,
        myGuessId,
        question
      );

      await respondToChallenge({
        challengeId,
        responderId: user!.id,
        responderGuessId: myGuessId,
        isCorrect: result === "correct",
        resultType: result,
        vibeLevel,
      });

      router.push(`/challenge/${challengeId}/results`);
      setSubmitting(false);
    }

    return (
      <div className="min-h-dvh bg-background pb-8">
        <Header
          title={`${question.emoji} Challenge from ${senderName}`}
        />

        <div className="px-4 pt-16">
          <div className="mb-6 text-center animate-fade-in">
            <p className="text-xs font-medium uppercase tracking-widest text-neon-pink">
              Guess their pick
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              What did {senderName} pick?
            </h2>
            <p className="mt-1 text-sm text-white/50">
              {question.prompt}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {question.options.map((option) => (
              <MediaCard
                key={option.id}
                item={option}
                selected={myGuessId === option.id}
                onSelect={() =>
                  setMyGuessId(myGuessId === option.id ? null : option.id)
                }
              />
            ))}
          </div>

          {myGuessId && (
            <button
              onClick={handleGuessSubmit}
              disabled={submitting}
              className="w-full animate-slide-up rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Checking..." : "See Results ✨"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- COMPARE: recipient picks their own, then we compare ---
  if (playMode === "compare") {
    async function handleCompareSubmit() {
      if (!myPickId || !challenge?.sender_option_id || !question) return;
      setSubmitting(true);

      const result = calculateCompareResult(
        challenge.sender_option_id,
        myPickId
      );
      const vibeLevel = calculateVibeLevel(
        challenge.sender_option_id,
        myPickId,
        question
      );

      await respondToChallenge({
        challengeId,
        responderId: user!.id,
        responderOptionId: myPickId,
        resultType: result,
        vibeLevel,
      });

      router.push(`/challenge/${challengeId}/results`);
      setSubmitting(false);
    }

    return (
      <div className="min-h-dvh bg-background pb-8">
        <Header
          title={`${question.emoji} Challenge from ${senderName}`}
        />

        <div className="px-4 pt-16">
          <div className="mb-6 text-center animate-fade-in">
            <p className="text-xs font-medium uppercase tracking-widest text-neon-cyan">
              Compare
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              {question.prompt}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Pick yours — then see if you match with {senderName}!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {question.options.map((option) => (
              <MediaCard
                key={option.id}
                item={option}
                selected={myPickId === option.id}
                onSelect={() =>
                  setMyPickId(myPickId === option.id ? null : option.id)
                }
              />
            ))}
          </div>

          {myPickId && (
            <button
              onClick={handleCompareSubmit}
              disabled={submitting}
              className="w-full animate-slide-up rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Comparing..." : "See Results ✨"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- TWO-PLAYER-GUESS: recipient answers same guess question, then compare ---
  if (playMode === "two-player-guess") {
    async function handleTwoPlayerGuessSubmit() {
      if (!myPickId || !challenge?.sender_option_id || !question) return;
      setSubmitting(true);

      const result = calculateCompareResult(
        challenge.sender_option_id,
        myPickId
      );
      const vibeLevel = calculateVibeLevel(
        challenge.sender_option_id,
        myPickId,
        question
      );

      await respondToChallenge({
        challengeId,
        responderId: user!.id,
        responderOptionId: myPickId,
        resultType: result,
        vibeLevel,
      });

      router.push(`/challenge/${challengeId}/results`);
      setSubmitting(false);
    }

    return (
      <div className="min-h-dvh bg-background pb-8">
        <Header
          title={`${question.emoji} Challenge from ${senderName}`}
        />

        <div className="px-4 pt-16">
          <div className="mb-6 text-center animate-fade-in">
            <p className="text-xs font-medium uppercase tracking-widest text-neon-purple">
              Two-player guess
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              {question.prompt}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Answer the same question — see if you match!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {question.options.map((option) => (
              <MediaCard
                key={option.id}
                item={option}
                selected={myPickId === option.id}
                onSelect={() =>
                  setMyPickId(myPickId === option.id ? null : option.id)
                }
              />
            ))}
          </div>

          {myPickId && (
            <button
              onClick={handleTwoPlayerGuessSubmit}
              disabled={submitting}
              className="w-full animate-slide-up rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Comparing..." : "See Results ✨"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background text-white/50">
      Unknown play mode
    </div>
  );
}
