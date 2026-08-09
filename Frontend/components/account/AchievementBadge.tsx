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
    <li
      className={`grid gap-2 rounded-world border border-world-border bg-world-surface p-4${
        unlocked ? "" : " opacity-55"
      }`}
    >
      {icon ? (
        <span className="text-3xl leading-none text-world-accent" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <h3 className="font-heading m-0 text-base text-world-text">{title}</h3>
      {description ? (
        <p className="m-0 text-sm text-world-text-muted">{description}</p>
      ) : null}
      <p className="m-0 text-xs text-world-text-muted">{earnedLabel}</p>
    </li>
  );
}
