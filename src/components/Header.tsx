import { useEffect, useRef } from "react";
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

/** 見出しがヘッダーに接しないための余白。 */
const HEADER_OFFSET_GAP_PX = 8;

/**
 * ヘッダーの実測高さを `--header-offset` として公開する。
 *
 * ヘッダーはnav pillの折り返しで高さが変わり、段数は幅と項目数
 * （`events.length` で「スケジュール」が増減する）に依存する。
 * breakpointごとの固定オフセットでは将来の項目追加で必ず破綻するので、
 * 実測値をそのまま各sectionの `scroll-margin-top` に渡す。
 */
function useHeaderOffset(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const root = document.documentElement;
    const apply = () => {
      const height = Math.ceil(element.getBoundingClientRect().height);
      root.style.setProperty(
        "--header-offset",
        `${height + HEADER_OFFSET_GAP_PX}px`,
      );
    };

    apply();

    // ResizeObserver が無い環境では resize だけで追従する（値は必ず入る）。
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", apply);
      return () => {
        window.removeEventListener("resize", apply);
        root.style.removeProperty("--header-offset");
      };
    }

    const observer = new ResizeObserver(apply);
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--header-offset");
    };
  }, [ref]);
}

export function Header() {
  const hubItems = hubNavigation();
  const sectionItems = sectionNavigation(events.length);
  const headerRef = useRef<HTMLElement>(null);

  useHeaderOffset(headerRef);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-20 border-b border-sage/15 bg-paper/90 backdrop-blur"
    >
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
