"use client";

import Image from "next/image";
import Link from "next/link";
import { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  index?: number;
}

export default function QuestionCard({ question, index = 0 }: QuestionCardProps) {
  return (
    <Link
      href={`/library/${question.id}`}
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[0.98] active:scale-[0.96] animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Cover image */}
      <div className="relative aspect-[3/2] w-full">
        <Image
          src={question.coverImageUrl}
          alt={question.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{question.emoji}</span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-white drop-shadow-lg">
              {question.title}
            </h3>
            <p className="truncate text-[11px] text-white/60">
              {question.options.length} options
            </p>
          </div>
        </div>
      </div>

      {/* Nature badge */}
      <div className="absolute top-2 right-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            question.nature === "choose"
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "bg-neon-pink/20 text-neon-pink"
          }`}
        >
          {question.nature === "choose" ? "Choose" : "Guess"}
        </span>
      </div>
    </Link>
  );
}
