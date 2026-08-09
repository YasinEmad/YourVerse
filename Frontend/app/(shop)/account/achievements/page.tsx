import Link from "next/link";
import { requireSession } from "@/lib/auth/getSession";
import { getMockAchievements } from "@/lib/account/achievements";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocaleFromHeaders } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { AchievementBadge } from "@/components/account/AchievementBadge";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  await requireSession();
  const dict = await getServerDictionary();
  const locale = getLocaleFromHeaders();
  const t = createTranslator(dict);

  const achievements = getMockAchievements().map((achievement) => ({
    id: achievement.id,
    title: t(achievement.titleKey),
    description: achievement.descriptionKey ? t(achievement.descriptionKey) : undefined,
    icon: achievement.icon,
    earnedAt: achievement.earnedAt,
  }));

  return (
    <div className="mx-auto w-full max-w-[60rem] px-6 pt-12 pb-24">
      <h1 className="font-heading m-0 mb-8 text-4xl leading-tight text-world-text">
        {dict.achievements.title}
      </h1>

      {achievements.length === 0 ? (
        <p className="m-0 text-world-text-muted">{dict.achievements.empty}</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] gap-4 p-0">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              earnedAt={achievement.earnedAt}
              t={t}
              locale={locale}
            />
          ))}
        </ul>
      )}

      <Link
        href="/account"
        className="mt-8 inline-flex items-center gap-2 rounded-world border border-world-border bg-transparent px-3 py-2 text-sm text-world-text-muted no-underline transition-colors duration-150 hover:border-world-primary hover:text-world-text"
      >
        {dict.orders.backToAccount}
      </Link>
    </div>
  );
}
