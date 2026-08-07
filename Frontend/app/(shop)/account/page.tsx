import Link from "next/link";
import { requireSession } from "@/lib/auth/getSession";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocaleFromHeaders } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { getMockAchievements } from "@/lib/account/achievements";
import { getLoyaltyProgress } from "@/lib/account/loyalty";
import { LoyaltyProgressBar } from "@/components/account/LoyaltyProgressBar";
import { AchievementBadge } from "@/components/account/AchievementBadge";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { user } = await requireSession();
  const dict = await getServerDictionary();
  const locale = getLocaleFromHeaders();
  const t = createTranslator(dict);

  const loyalty = getLoyaltyProgress(user.loyaltyPoints);
  const achievements = getMockAchievements()
    .filter((achievement) => achievement.earnedAt !== null)
    .slice(0, 3)
    .map((achievement) => ({
      id: achievement.id,
      title: t(achievement.titleKey),
      description: achievement.descriptionKey ? t(achievement.descriptionKey) : undefined,
      icon: achievement.icon,
      earnedAt: achievement.earnedAt,
    }));

  return (
    <div className="shop-page__inner">
      <h1 className="shop-page__title">{dict.account.title}</h1>

      <section className="account-panel">
        <h2 className="account-panel__name">
          {t("account.welcome", { name: user.name ?? user.email })}
        </h2>
        <dl className="account-meta">
          <div>
            <dt>{dict.account.email}</dt>
            <dd>{user.email}</dd>
          </div>
          {user.favoriteWorld ? (
            <div>
              <dt>{dict.account.favoriteWorld}</dt>
              <dd>{user.favoriteWorld}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="account-section">
        <h2 className="account-section__title">{dict.loyalty.title}</h2>
        <LoyaltyProgressBar
          points={user.loyaltyPoints}
          tierLabel={t(loyalty.tierKey)}
          nextTierLabel={loyalty.nextTierKey ? t(loyalty.nextTierKey) : undefined}
          pointsToNext={loyalty.pointsToNext}
          progress={loyalty.progress}
          t={t}
        />
      </section>

      {achievements.length > 0 ? (
        <section className="account-section">
          <h2 className="account-section__title">{dict.account.recentAchievements}</h2>
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
        </section>
      ) : null}

      <nav className="account-nav" aria-label={dict.account.title}>
        <Link href="/account/orders" className="account-nav__link">
          {dict.account.orders}
        </Link>
        <Link href="/account/achievements" className="account-nav__link">
          {dict.account.achievements}
        </Link>
      </nav>
    </div>
  );
}
