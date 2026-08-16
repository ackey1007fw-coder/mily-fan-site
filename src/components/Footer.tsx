import { profile } from "../data/profile";
import { site } from "../data/site";

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
      </div>
    </footer>
  );
}
