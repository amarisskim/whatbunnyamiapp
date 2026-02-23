import Header from "@/components/Header";
import QuestionCard from "@/components/QuestionCard";
import { getQuestionsBySection } from "@/data/questions";

export default function LibraryPage() {
  const selfSelectQuestions = getQuestionsBySection("self-select");
  const algorithmQuestions = getQuestionsBySection("algorithm");

  return (
    <div className="min-h-dvh bg-background pb-24">
      <Header title="Library" showBack={false} />

      <div className="px-4 pt-16">
        {/* Self-select section */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">🪞 About Me</h2>
            <p className="mt-1 text-sm text-white/40">
              Pick your favorite — discover your vibe
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {selfSelectQuestions.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} />
            ))}
          </div>
        </div>

        {/* Algorithm section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">🔮 About Friends</h2>
            <p className="mt-1 text-sm text-white/40">
              Guess what your friend would pick
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {algorithmQuestions.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
