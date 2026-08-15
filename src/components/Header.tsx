import { events } from "../data/events";
import { profile } from "../data/profile";
import { visibleNavItems } from "../lib/navigation";

export function Header() {
  const navItems = visibleNavItems(events.length);

  return (
    <header className="sticky top-0 z-20 border-b border-sage/15 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
        <a href="#top" className="min-w-0 font-semibold tracking-wide text-sage-deep">
          {profile.displayName}
          <span className="ml-2 text-xs font-medium text-ink-muted">ファンサイト</span>
        </a>
        <nav aria-label="ページ内ナビ" className="hidden items-center gap-3 text-sm sm:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-2 py-1 text-ink-muted hover:bg-sage-soft hover:text-sage-deep"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <nav
        aria-label="モバイルナビ"
        className="flex flex-wrap gap-2 px-4 pb-2.5 sm:hidden"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-sage-soft px-3 py-2 text-sm text-sage-deep"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
