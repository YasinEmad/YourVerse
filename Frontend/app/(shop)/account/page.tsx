import Link from "next/link";
import { requireSession } from "@/lib/auth/getSession";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocaleFromHeaders } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { getMockAchievements } from "@/lib/account/achievements";
import { getLoyaltyProgress } from "@/lib/account/loyalty";
import { LoyaltyProgressBar } from "@/components/account/LoyaltyProgressBar";
import { AchievementBadge } from "@/components/account/AchievementBadge";
import { SignOutButton } from "@/components/account/SignOutButton";

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
    <div className="mx-auto w-full max-w-[60rem] px-6 pt-12 pb-24">
      <h1 className="font-heading m-0 mb-8 text-4xl leading-tight text-world-text">
        {dict.account.title}
      </h1>

      <section className="grid gap-4 rounded-world border border-world-border bg-world-surface p-6">
        <h2 className="font-heading m-0 text-2xl leading-snug text-world-text">
          {t("account.welcome", { name: user.name ?? user.email })}
        </h2>
        <dl className="m-0 grid gap-2">
          <div className="flex items-baseline gap-2">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {dict.account.email}
            </dt>
            <dd className="m-0 text-sm text-world-text">{user.email}</dd>
          </div>
          {user.favoriteWorld ? (
            <div className="flex items-baseline gap-2">
              <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
                {dict.account.favoriteWorld}
              </dt>
              <dd className="m-0 text-sm text-world-text">{user.favoriteWorld}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="mt-10 grid gap-4">
        <h2 className="font-heading m-0 text-lg text-world-text">{dict.loyalty.title}</h2>
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
        <section className="mt-10 grid gap-4">
          <h2 className="font-heading m-0 text-lg text-world-text">
            {dict.account.recentAchievements}
          </h2>
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
        </section>
      ) : null}

      <nav className="mt-10 flex flex-wrap gap-2" aria-label={dict.account.title}>
        <Link
          href="/account/orders"
          className="inline-flex cursor-pointer items-center gap-2 rounded-world border border-world-border bg-transparent px-3 py-2 text-sm text-world-text-muted no-underline transition-colors duration-150 enabled:hover:border-world-primary enabled:hover:text-world-text"
        >
          {dict.account.orders}
        </Link>
        <Link
          href="/account/achievements"
          className="inline-flex cursor-pointer items-center gap-2 rounded-world border border-world-border bg-transparent px-3 py-2 text-sm text-world-text-muted no-underline transition-colors duration-150 enabled:hover:border-world-primary enabled:hover:text-world-text"
        >
          {dict.account.achievements}
        </Link>
        <SignOutButton />
      </nav>
    </div>
  );
}
