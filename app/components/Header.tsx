"use client";

import { Sparkles, Settings } from "lucide-react";

interface IHeaderProps {
  onConfigClick: () => void;
}

export default function Header({ onConfigClick }: IHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-indigo-600" />
        <span className="text-xl font-semibold text-zinc-900">
          AI 简历匹配分析
        </span>
      </div>
      <button
        onClick={onConfigClick}
        className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
        title="模型配置"
      >
        <Settings className="h-5 w-5" />
      </button>
    </header>
  );
}
