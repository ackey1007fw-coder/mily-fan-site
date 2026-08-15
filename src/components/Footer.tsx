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
          {profile.displayName}（{profile.legalName}）さん本人、関係者、所属先の公式サイトではありません。
          公認・後援・本人運営と受け取れる表現は使いません。
        </p>
        <p className="mt-2">
          掲載内容は確認できた公開情報に限っています。間違いを見つけた場合は、確認のうえ修正します。
        </p>
        <p className="mt-6 text-xs">
          写真・画像の自動取得や、実在する本人の顔の生成は行いません。
        </p>
      </div>
    </footer>
  );
}
