interface SkillMatchBarProps {
  label: string;
  score: number;
}

export default function SkillMatchBar({ label, score }: SkillMatchBarProps) {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-emerald-500";
    if (s >= 60) return "bg-amber-500";
    return "bg-red-400";
  };

  return (
    <div className="flex items-center gap-4">
      <span className="w-16 text-sm font-medium text-zinc-700">{label}</span>
      <div className="flex flex-1 items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${getColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="w-8 text-right text-sm font-semibold text-zinc-900">
          {score}
        </span>
      </div>
    </div>
  );
}
