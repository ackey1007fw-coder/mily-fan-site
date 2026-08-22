/**
 * ホーム内anchorのスクロールオフセット。
 *
 * ヘッダーは `md` 未満でnav pillが複数段になり、実測で
 * 320px=203px / 390〜640px=151px / 640〜767px=99px / 768px以上=57px の高さになる。
 * `scroll-mt-24`（96px）のままだと、`md` 未満で #latest や #stories へ移動したとき
 * 見出しがヘッダーの下へ隠れる。段数に合わせて各breakpointでオフセットを取る。
 *
 * 値を変えるときは `scripts/top-integration.test.mjs` の実測前提も合わせて見直す。
 */
export const SECTION_ANCHOR_OFFSET =
  "scroll-mt-52 sm:scroll-mt-40 md:scroll-mt-24";

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
