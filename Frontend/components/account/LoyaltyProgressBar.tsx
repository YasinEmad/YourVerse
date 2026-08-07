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
    <section className="loyalty-bar" aria-label={t("loyalty.title")}>
      <div className="loyalty-bar__head">
        <span className="loyalty-bar__tier">{tierLabel}</span>
        <span className="loyalty-bar__points">{t("loyalty.points", { points })}</span>
      </div>
      <div
        className="loyalty-bar__track"
        role="progressbar"
        aria-label={t("loyalty.title")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="loyalty-bar__fill" style={{ inlineSize: `${percent}%` }} />
      </div>
      <p className="loyalty-bar__hint">
        {pointsToNext > 0 && nextTierLabel
          ? t("loyalty.pointsToNext", { points: pointsToNext, tier: nextTierLabel })
          : t("loyalty.maxTier")}
      </p>
    </section>
  );
}
