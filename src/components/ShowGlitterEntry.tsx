import { useEffect } from "react";
import { watchGlitterFragment } from "../lib/glitterFragment";

/** Supportの先頭でガイドを見つけられる入口。既存記事・予定は削除しない。 */
export function ShowGlitterEntry() {
  useEffect(() => watchGlitterFragment(window, document), []);
  return (
    <nav aria-label="注目の応援ガイド" className="border-b border-amber-200 bg-amber-50 px-4 py-2">
      <a
        data-glitter-entry
        href="#show-glitter-guide"
        className="mx-auto flex min-h-11 max-w-3xl items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-sm font-bold leading-6 text-amber-900 underline underline-offset-4 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
      >
        <span aria-hidden="true">🥇</span>
        金グリッターの獲得・維持ガイドを読む
        <span aria-hidden="true">↓</span>
      </a>
    </nav>
  );
}
