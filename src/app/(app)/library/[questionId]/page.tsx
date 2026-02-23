"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getQuestionById } from "@/data/questions";
import { PlayMode } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/auth";
import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const questionId = params.questionId as string;
  const question = getQuestionById(questionId);
  const [saved, setSaved] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!user || !question) return;
    loadSaved();
  }, [user, questionId]);

  async function loadSaved() {
    const supabase = createClient();
    const { data } = await supabase
      .from("saved_challenges")
      .select("id")
      .eq("user_id", user!.id)
      .eq("question_id", questionId)
      .maybeSingle();

    setSaved(!!data);
  }

  async function handleSave() {
    if (!user) return;
    const supabase = createClient();

    if (saved) {
      await supabase
        .from("saved_challenges")
        .delete()
        .eq("user_id", user.id)
        .eq("question_id", questionId);
      setSaved(false);
    } else {
      await supabase.from("saved_challenges").insert({
        user_id: user.id,
        question_id: questionId,
      });
      setSaved(true);
    }
  }

  async function handleStart(playMode: PlayMode) {
    if (!user || starting) return;
    setStarting(true);

    const supabase = createClient();

    const { data, error } = await supabase
      .from("challenges")
      .insert({
        sender_id: user.id,
        question_id: questionId,
        play_mode: playMode,
        status: "active",
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Failed to create challenge:", error);
      setStarting(false);
      return;
    }

    router.push(`/challenge/${data.id}/play`);
  }

  if (!question) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-white/50">
        Question not found
      </div>
    );
  }

  // Determine the friend challenge mode based on question nature
  // "choose" questions → compare (both pick, then compare)
  // "guess" questions → two-player-guess (both answer, then compare)
  const friendMode: PlayMode =
    question.nature === "choose" ? "compare" : "two-player-guess";

  return (
    <div className="min-h-dvh bg-background pb-24">
      <Header title={`${question.emoji} ${question.title}`} />

      {/* Cover image */}
      <div className="relative h-48 w-full">
        <Image
          src={question.coverImageUrl}
          alt={question.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Description */}
      <div className="px-4 -mt-8 relative z-10 mb-6">
        <p className="text-sm text-white/60">{question.prompt}</p>
        <p className="mt-1 text-xs text-white/30">
          {question.options.length} options to choose from
        </p>
        {/* Save button */}
        <button
          onClick={handleSave}
          className={`mt-3 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
            saved
              ? "bg-neon-cyan/10 text-neon-cyan"
              : "bg-white/[0.06] text-white/40 hover:text-white/60"
          }`}
        >
          {saved ? "🔖 Saved" : "🔖 Save for later"}
        </button>
      </div>

      {/* Preview of options */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {question.options.map((option) => (
            <div
              key={option.id}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
            >
              <Image
                src={option.imageUrl}
                alt={option.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Simplified play modes — 2 clear options */}
      <div className="px-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          How do you want to play?
        </h2>
        <div className="flex flex-col gap-3">
          {/* Play Solo */}
          <button
            onClick={() => handleStart("solo")}
            disabled={starting}
            className="glass rounded-2xl p-4 text-left transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-2xl">
                💖
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">Play Solo</h3>
                <p className="mt-0.5 text-xs text-white/50">
                  Pick your favorite — no friends needed
                </p>
              </div>
              <span className="text-white/30">→</span>
            </div>
          </button>

          {/* Challenge a Friend */}
          <button
            onClick={() => handleStart(friendMode)}
            disabled={starting}
            className="glass rounded-2xl p-4 text-left transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 text-2xl">
                🤝
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">
                  Challenge a Friend
                </h3>
                <p className="mt-0.5 text-xs text-white/50">
                  {question.nature === "choose"
                    ? "Both pick, then see if your vibes match"
                    : "Both answer, then see your vibe level"}
                </p>
              </div>
              <span className="text-white/30">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
