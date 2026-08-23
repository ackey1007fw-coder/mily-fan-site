import { ACTIVITIES_HUB_ROUTE } from "./activityRoute.ts";
import {
  GALLERY_ARCHIVE_ROUTE,
  HOME_ROUTE,
  NEWS_ARCHIVE_ROUTE,
  PROFILE_ROUTE,
  STORIES_ARCHIVE_ROUTE,
} from "./homePortal.ts";
import { SUPPORT_HUB_ROUTE } from "./supportHub.ts";

/**
 * ホーム内anchorのスクロールオフセット。
 *
 * ヘッダー高さはメニュー開閉で変わるので、固定breakpoint値は使わない。
 * `Header` が描画後の実測高さを `--header-offset` へ書き込む。
 * 既定値は `src/index.css` の `:root`（JS実行前のフォールバック）。
 */
export const SECTION_ANCHOR_OFFSET = "[scroll-margin-top:var(--header-offset)]";

export type NavItem = {
  href: string;
  label: string;
  kind: "route";
};

/**
 * Hub / archive への route navigation。
 * ホーム内anchor中心だった旧ナビは、コンテンツ量が増えても
 * ヘッダーが高さ方向へ伸びない route 一覧へ移した。
 */
const siteNavItems: NavItem[] = [
  { href: HOME_ROUTE, label: "ホーム", kind: "route" },
  { href: ACTIVITIES_HUB_ROUTE, label: "活動", kind: "route" },
  { href: SUPPORT_HUB_ROUTE, label: "応援・予定", kind: "route" },
  { href: NEWS_ARCHIVE_ROUTE, label: "最新情報", kind: "route" },
  { href: STORIES_ARCHIVE_ROUTE, label: "STORY", kind: "route" },
  { href: GALLERY_ARCHIVE_ROUTE, label: "ギャラリー", kind: "route" },
  { href: PROFILE_ROUTE, label: "プロフィール", kind: "route" },
];

export function hubNavigation(): NavItem[] {
  return siteNavItems.filter((item) => item.href !== HOME_ROUTE);
}

export function sectionNavigation(_eventCount = 0): NavItem[] {
  return [];
}

export function visibleNavItems(_eventCount = 0): NavItem[] {
  return [...siteNavItems];
}
