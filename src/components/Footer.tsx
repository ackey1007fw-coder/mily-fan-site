import { profile } from "../data/profile";
import { site } from "../data/site";

const OUEN_ARCHIVE_URL = "https://ouen-archive-564c.vercel.app/";

export function Footer() {
  return (
    <footer className="border-t border-sage/15 px-4 py-10">
      <div className="mx-auto max-w-3xl text-sm leading-relaxed text-ink-muted">
        <p className="font-semibold text-ink">
          {site.displayTitle}はファン制作の非公式サイトです。
        </p>
        <p className="mt-2">
          {profile.displayName}（{profile.publicName}）さんの公式・公認・本人運営ではありません。
        </p>
        <div className="mt-8 border-t border-sage/15 pt-6">
          <a
            href={OUEN_ARCHIVE_URL}
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-ink-muted underline decoration-sage/50 underline-offset-4 transition hover:text-sage"
          >
            <span aria-hidden="true">←</span>
            応援アーカイブへ戻る
          </a>
          <p className="mt-1 text-xs text-ink-muted/80">
            5つの応援サイトをつなぐ非公式ポータル
          </p>
        </div>
      </div>
    </footer>
  );
}
