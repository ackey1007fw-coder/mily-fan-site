import { profile } from "../data/profile";

const navItems = [
  { href: "#latest", label: "最新情報" },
  { href: "#gallery", label: "ギャラリー" },
  { href: "#schedule", label: "スケジュール" },
  { href: "#about", label: "プロフィール" },
  { href: "#links", label: "リンク" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-sage/15 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
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
        className="flex gap-2 overflow-x-auto px-4 pb-3 sm:hidden"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full bg-sage-soft px-3 py-1.5 text-sm text-sage-deep"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
