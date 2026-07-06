"use client";

import { CheckCircle2 } from "lucide-react";
import SkillMatchBar from "./SkillMatchBar";
import SuggestionList from "./SuggestionList";

interface AnalysisResultProps {
  matchScore: number;
  summary: string;
  detailSummary: string;
  skills: { label: string; score: number }[];
  suggestions: string[];
}

/**
 * 分析结果组件
 */

export default function AnalysisResult({
  matchScore,
  summary,
  detailSummary,
  skills,
  suggestions,
}: AnalysisResultProps) {
  const getMatchLabel = (score: number) => {
    if (score >= 80) return "高度匹配";
    if (score >= 60) return "中度匹配";
    return "低度匹配";
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Overall Match Score */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#e4e4e7"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={
                  matchScore >= 80
                    ? "#10b981"
                    : matchScore >= 60
                      ? "#f59e0b"
                      : "#ef4444"
                }
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(matchScore / 100) * 327} 327`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span
                className={`text-2xl font-bold ${getMatchColor(matchScore)}`}
              >
                {matchScore}%
              </span>
              <span className="text-xs font-medium text-zinc-500">match</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <CheckCircle2
                className={`h-5 w-5 ${getMatchColor(matchScore)}`}
              />
              <span
                className={`text-lg font-semibold ${getMatchColor(matchScore)}`}
              >
                {getMatchLabel(matchScore)}
              </span>
            </div>
            <h4 className="mt-1 text-sm font-medium text-zinc-900">
              {summary}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">
              {detailSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-category Scores */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-5 text-base font-semibold text-zinc-900">
          分项匹配度
        </h3>
        <div className="space-y-4">
          {skills.map((skill) => (
            <SkillMatchBar
              key={skill.label}
              label={skill.label}
              score={skill.score}
            />
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <SuggestionList suggestions={suggestions} />
    </div>
  );
}
