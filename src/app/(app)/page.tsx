import Link from "next/link";
import { getQuestionsBySection } from "@/data/questions";
import QuestionCard from "@/components/QuestionCard";

export default function Home() {
  const selfSelect = getQuestionsBySection("self-select").slice(0, 3);
  const algorithm = getQuestionsBySection("algorithm").slice(0, 2);

  return (
    <div className="min-h-dvh bg-background px-4 pb-12 pt-6">
      {/* Hero */}
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            VibeCheck
          </span>
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Pick your favorites. Challenge your friends. See if they really know
          you.
        </p>
      </div>

      {/* Featured questions */}
      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          🪞 About me
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {selfSelect.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          🔮 About friends
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {algorithm.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="flex flex-col gap-3">
        <Link
          href="/library"
          className="glass group flex items-center gap-4 rounded-2xl p-4 transition-all hover:bg-white/10 active:scale-[0.98]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-purple/20 text-2xl">
            📚
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">All Questions</h3>
            <p className="text-xs text-white/50">
              Browse all challenges
            </p>
          </div>
          <span className="ml-auto text-white/30">→</span>
        </Link>

        <Link
          href="/friends"
          className="glass group flex items-center gap-4 rounded-2xl p-4 transition-all hover:bg-white/10 active:scale-[0.98]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-cyan/20 text-2xl">
            👯
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">Invite Friends</h3>
            <p className="text-xs text-white/50">
              Share your invite link to connect
            </p>
          </div>
          <span className="ml-auto text-white/30">→</span>
        </Link>
      </section>
    </div>
  );
}
