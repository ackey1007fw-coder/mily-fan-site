export type NavItem = {
  href: string;
  label: string;
};

const baseNavItems: NavItem[] = [
  { href: "#latest", label: "最新情報" },
  { href: "#stories", label: "STORY" },
  { href: "#support", label: "応援する" },
  { href: "#gallery", label: "ギャラリー" },
  { href: "/profile/", label: "プロフィール" },
  { href: "#links", label: "リンク" },
];

export function visibleNavItems(eventCount: number): NavItem[] {
  const items = [...baseNavItems];

  if (eventCount > 0) {
    items.splice(3, 0, { href: "#schedule", label: "スケジュール" });
  }

  return items;
}
