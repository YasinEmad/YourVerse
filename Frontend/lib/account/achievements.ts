export interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  icon?: string;
  earnedAt: string | null;
}

export function getMockAchievements(): Achievement[] {
  return [
    {
      id: "first-order",
      titleKey: "achievements.items.first-order.title",
      descriptionKey: "achievements.items.first-order.description",
      icon: "◆",
      earnedAt: "2026-01-12T10:30:00.000Z",
    },
    {
      id: "collector",
      titleKey: "achievements.items.collector.title",
      descriptionKey: "achievements.items.collector.description",
      icon: "✦",
      earnedAt: null,
    },
    {
      id: "vip",
      titleKey: "achievements.items.vip.title",
      descriptionKey: "achievements.items.vip.description",
      icon: "★",
      earnedAt: null,
    },
  ];
}
