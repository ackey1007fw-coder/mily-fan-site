export type NavItem = {
  href: string;
  label: string;
  /** 独立ページへのroute（Hub）か、ホーム内のanchorか */
  kind: "route" | "anchor";
};

/**
 * Hub route。Activities / Support / Profile をヘッダーの先頭に置き、
 * ホーム内anchorに埋もれないようにする。
 */
const hubNavItems: NavItem[] = [
  { href: "/activities/", label: "Activities", kind: "route" },
  { href: "/support/", label: "応援・予定", kind: "route" },
  { href: "/profile/", label: "プロフィール", kind: "route" },
];

/**
 * ホーム内anchor。`#support` はHub route（`/support/`）へ移したので持たない。
 * Latest / STORY / ギャラリー / リンク / スケジュールは到達手段として残す。
 */
const sectionNavItems: NavItem[] = [
  { href: "#latest", label: "最新情報", kind: "anchor" },
  { href: "#stories", label: "STORY", kind: "anchor" },
  { href: "#gallery", label: "ギャラリー", kind: "anchor" },
  { href: "#links", label: "リンク", kind: "anchor" },
];

export function hubNavigation(): NavItem[] {
  return [...hubNavItems];
}

export function sectionNavigation(eventCount: number): NavItem[] {
  const items = [...sectionNavItems];

  if (eventCount > 0) {
    items.splice(2, 0, {
      href: "#schedule",
      label: "スケジュール",
      kind: "anchor",
    });
  }

  return items;
}

export function visibleNavItems(eventCount: number): NavItem[] {
  return [...hubNavigation(), ...sectionNavigation(eventCount)];
}
