import { Lightbulb } from "lucide-react";

interface SuggestionListProps {
  suggestions: string[];
}

export default function SuggestionList({ suggestions }: SuggestionListProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h3 className="text-base font-semibold text-zinc-900">优化建议</h3>
      </div>
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li
            key={`suggestion-${
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              index
            }`}
            className="flex items-start gap-3 rounded-lg bg-zinc-50 px-4 py-3"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-zinc-700">
              {suggestion}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
