import type { Translate } from "@/lib/i18n/translate";

export interface LoyaltyProgressBarProps {
  points: number;
  tierLabel: string;
  nextTierLabel?: string;
  pointsToNext: number;
  progress: number;
  t: Translate;
}

export function LoyaltyProgressBar({
  points,
  tierLabel,
  nextTierLabel,
  pointsToNext,
  progress,
  t,
}: LoyaltyProgressBarProps) {
  const percent = Math.round(progress * 100);

  return (
    <section
      className="grid gap-3 rounded-world border border-world-border bg-world-surface p-4"
      aria-label={t("loyalty.title")}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-heading text-base font-bold text-world-text">{tierLabel}</span>
        <span className="font-mono text-sm text-world-text-muted">
          {t("loyalty.points", { points })}
        </span>
      </div>
      <div
        className="h-[0.625rem] overflow-hidden rounded-full bg-world-border"
        role="progressbar"
        aria-label={t("loyalty.title")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full rounded-full bg-world-primary" style={{ inlineSize: `${percent}%` }} />
      </div>
      <p className="m-0 text-xs text-world-text-muted">
        {pointsToNext > 0 && nextTierLabel
          ? t("loyalty.pointsToNext", { points: pointsToNext, tier: nextTierLabel })
          : t("loyalty.maxTier")}
      </p>
    </section>
  );
}
