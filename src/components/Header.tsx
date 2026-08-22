import { events } from "../data/events";
import { profile } from "../data/profile";
import { hubNavigation, sectionNavigation } from "../lib/navigation";

/**
 * Hub route（Activities / Support / Profile）を先に、ホーム内anchorを後に置く。
 *
 * 1行に7項目を並べると max-w-3xl では窮屈になるため、`md` 未満では
 * 2段目のコンパクトなpill列へ全項目を送る。どの幅でも横スクロールを作らない。
 */
const desktopHubLink =
  "inline-flex min-h-9 shrink-0 items-center rounded-full bg-sage-soft px-2.5 py-1 text-sm font-semibold text-sage-deep hover:bg-sage hover:text-white";
const desktopSectionLink =
  "inline-flex min-h-9 shrink-0 items-center rounded-full px-1.5 py-1 text-sm text-ink-muted hover:bg-sage-soft hover:text-sage-deep";
const compactHubLink =
  "inline-flex min-h-11 shrink-0 items-center rounded-full bg-sage px-3 py-2 text-sm font-semibold text-white";
const compactSectionLink =
  "inline-flex min-h-11 shrink-0 items-center rounded-full bg-sage-soft px-3 py-2 text-sm text-sage-deep";

export function Header() {
  const hubItems = hubNavigation();
  const sectionItems = sectionNavigation(events.length);

  return (
    <header className="sticky top-0 z-20 border-b border-sage/15 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
        <a href="#top" className="min-w-0 font-semibold tracking-wide text-sage-deep">
          {profile.displayName}
          <span className="ml-2 text-xs font-medium text-ink-muted">ファンサイト</span>
        </a>
        <nav
          aria-label="サイトナビ"
          className="hidden flex-wrap items-center justify-end gap-x-1 gap-y-1 md:flex"
        >
          {hubItems.map((item) => (
            <a key={item.href} href={item.href} className={desktopHubLink}>
              {item.label}
            </a>
          ))}
          {sectionItems.map((item) => (
            <a key={item.href} href={item.href} className={desktopSectionLink}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <nav
        aria-label="サイトナビ（小さい画面用）"
        className="flex flex-wrap gap-2 px-4 pb-2.5 md:hidden"
      >
        {hubItems.map((item) => (
          <a key={item.href} href={item.href} className={compactHubLink}>
            {item.label}
          </a>
        ))}
        {sectionItems.map((item) => (
          <a key={item.href} href={item.href} className={compactSectionLink}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
