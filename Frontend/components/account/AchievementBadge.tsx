import type { Translate } from "@/lib/i18n/translate";

export interface AchievementBadgeProps {
  title: string;
  description?: string;
  icon?: string;
  earnedAt?: string | null;
  t: Translate;
  locale: string;
}

export function AchievementBadge({
  title,
  description,
  icon,
  earnedAt,
  t,
  locale,
}: AchievementBadgeProps) {
  const unlocked = Boolean(earnedAt);
  const earnedLabel = unlocked
    ? t("achievements.unlockedOn", {
        date: new Date(earnedAt as string).toLocaleDateString(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      })
    : t("achievements.locked");

  return (
    <li className={`achievement-card${unlocked ? "" : " is-locked"}`}>
      {icon ? (
        <span className="achievement-card__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <h3 className="achievement-card__title">{title}</h3>
      {description ? <p className="achievement-card__description">{description}</p> : null}
      <p className="achievement-card__meta">{earnedLabel}</p>
    </li>
  );
}
