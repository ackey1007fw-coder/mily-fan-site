import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { profile } from "../data/profile";
import { HOME_ROUTE } from "../lib/homePortal";
import { visibleNavItems } from "../lib/navigation";

const desktopLink =
  "inline-flex min-h-9 shrink-0 items-center rounded-full px-2 py-1 text-sm font-medium text-ink-muted hover:bg-sage-soft hover:text-sage-deep";
const menuLink =
  "inline-flex min-h-11 w-full items-center rounded-xl px-3 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft";
const menuButton =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-sage/30 bg-paper-card px-4 text-sm font-semibold text-sage-deep hover:bg-sage-soft lg:hidden";

const HEADER_OFFSET_GAP_PX = 8;

function useHeaderOffset(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const root = document.documentElement;
    let published: number | null = null;
    const publish = (rawHeight: number) => {
      const height = Math.ceil(rawHeight);
      // 同じ値の再書き込みで style 再計算を起こさない
      if (height === published) return;
      published = height;
      root.style.setProperty(
        "--header-offset",
        `${height + HEADER_OFFSET_GAP_PX}px`,
      );
    };
    const measure = () => publish(element.getBoundingClientRect().height);

    if (typeof ResizeObserver === "undefined") {
      // 非対応環境: 初回と resize を rAF にまとめ、同期 reflow を避ける
      let frame = requestAnimationFrame(measure);
      const onResize = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(measure);
      };
      window.addEventListener("resize", onResize);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", onResize);
        root.style.removeProperty("--header-offset");
      };
    }

    // ResizeObserver は observe 直後（初回レイアウト後）にも通知するため、
    // effect 内で同期的に計測しない。entry のサイズを使い reflow を強制しない。
    const observer = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;
      const box = entry.borderBoxSize?.[0];
      if (box) publish(box.blockSize);
      else measure();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--header-offset");
    };
  }, [ref]);
}

export function Header() {
  const items = visibleNavItems();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useHeaderOffset(headerRef);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-20 border-b border-sage/15 bg-paper/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
        <a
          href={HOME_ROUTE}
          className="shrink-0 font-semibold tracking-wide text-sage-deep"
        >
          {profile.displayName}
          <span className="ml-2 text-xs font-medium text-ink-muted">
            ファンサイト
          </span>
        </a>
        <nav
          aria-label="サイトナビ"
          className="hidden min-w-0 flex-nowrap items-center justify-end gap-x-0.5 gap-y-1 lg:flex"
        >
          {items.map((item) => (
            <a key={item.href} href={item.href} className={desktopLink}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className={menuButton}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
        >
          メニュー
        </button>
      </div>
      <nav
        id={menuId}
        hidden={!open}
        aria-label="サイトメニュー"
        className="border-t border-sage/15 px-4 py-2 lg:hidden"
      >
        <ul className="mx-auto max-w-5xl space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={menuLink}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
