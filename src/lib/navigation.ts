/**
 * ホーム内anchorのスクロールオフセット。
 *
 * ヘッダーの高さは幅とnav項目数で変わる。項目数は `events.length` に依存し
 * （`events` が非空になると「スケジュール」pillが増える）、実測では
 * 8項目のとき 320〜390px=203px / 430〜767px=151px / **768px以上=97px** になる。
 * breakpointごとの固定値では 768px以上の 97px を `scroll-mt-24`（96px）で
 * 賄えず、将来項目が増えるたびに見直しが必要になる。
 *
 * そこで固定値をやめ、`Header` が描画後の実測高さを CSS custom property
 * `--header-offset` へ書き込み、各sectionはそれを参照する。
 * 幅・項目数・フォントが変わっても常に実際のヘッダーより下へ着地する。
 * 既定値は `src/index.css` の `:root`（JS実行前のフォールバック）。
 */
export const SECTION_ANCHOR_OFFSET = "[scroll-margin-top:var(--header-offset)]";

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
