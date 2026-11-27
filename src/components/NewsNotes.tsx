import type { NewsItem } from "../data/news";

/**
 * Verification caveats of one NEWS item (`notes`).
 * Shared by every surface that renders a NEWS body (HOME hero, Latest / NEWS, Activity pages)
 * so a caveat moved out of `body` is never dropped from any of them.
 */
export function NewsNotes({ notes, className = "mt-4" }: { notes: NewsItem["notes"]; className?: string }) {
  if (!notes?.length) return null;
  return (
    <aside
      aria-label="確認状況・注記"
      data-news-notes
      className={`${className} rounded-xl border border-dashed border-sage/25 bg-paper px-4 py-3`}
    >
      <p className="text-[11px] font-semibold tracking-wide text-ink-muted">確認状況・注記</p>
      <div className="mt-1 space-y-1 text-xs leading-relaxed text-ink-muted">
        {notes.map((note) => (
          <p key={note} data-news-note>
            {note}
          </p>
        ))}
      </div>
    </aside>
  );
}
