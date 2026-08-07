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
    <div className="shop-page__inner">
      <h1 className="shop-page__title">{dict.achievements.title}</h1>

      {achievements.length === 0 ? (
        <p className="shop-empty">{dict.achievements.empty}</p>
      ) : (
        <ul className="achievement-list">
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

      <Link href="/account" className="account-back-link">
        {dict.orders.backToAccount}
      </Link>
    </div>
  );
}
