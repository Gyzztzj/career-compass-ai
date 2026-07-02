"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_LENGTH = 5000;

export default function JDInput({ value, onChange }: JDInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-zinc-900">
          岗位描述（JD）
        </h3>
      </div>

      <div
        className={`relative rounded-lg border transition-colors ${
          isFocused
            ? "border-indigo-400 ring-2 ring-indigo-100"
            : "border-zinc-200"
        }`}
      >
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_LENGTH) {
              onChange(e.target.value);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="请粘贴或输入岗位描述内容..."
          rows={4}
          className="w-full resize-none rounded-lg bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none"
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-zinc-400">
          请详细描述岗位职责、技能要求和任职资格
        </p>
        <span className="text-xs text-zinc-400">
          {value.length} / {MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
