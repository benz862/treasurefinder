interface LimitCounterProps {
  current: number;
  max: number;
  label?: string;
}

export function LimitCounter({ current, max, label = "homes" }: LimitCounterProps) {
  const ratio = max > 0 ? current / max : 0;
  const isNearLimit = ratio >= 0.8;
  const isAtLimit = current >= max;

  return (
    <div className="rounded-xl border border-teal-100 bg-white p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-charcoal capitalize">{label} used</span>
        <span
          className={`font-bold ${
            isAtLimit ? "text-coral" : isNearLimit ? "text-yellow-700" : "text-teal"
          }`}
        >
          {current} / {max}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-teal/10">
        <div
          className={`h-full rounded-full transition-all ${
            isAtLimit ? "bg-coral" : isNearLimit ? "bg-yellow" : "bg-teal"
          }`}
          style={{ width: `${Math.min(ratio * 100, 100)}%` }}
        />
      </div>
      {isAtLimit && (
        <p className="mt-2 text-xs text-coral">
          You&apos;ve reached your plan limit. Upgrade to add more {label}.
        </p>
      )}
    </div>
  );
}
