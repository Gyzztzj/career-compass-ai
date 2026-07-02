"use client";

import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-indigo-600" />
        <span className="text-xl font-semibold text-zinc-900">
          AI 简历匹配分析
        </span>
      </div>
    </header>
  );
}
