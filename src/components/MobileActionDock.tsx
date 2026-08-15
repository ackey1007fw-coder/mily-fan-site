const ENTRY_URL = "https://2026.misscircle.jp/entry/734";

/**
 * スマホ専用の画面下部固定ドック。ENTRY 734 への導線を常に押しやすくする。
 * 画面を占有しすぎないよう、細い1段のみ。
 */
export function MobileActionDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sage/20 bg-paper/95 px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <a
          href={ENTRY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-sage px-4 text-sm font-semibold text-white hover:bg-sage-deep"
        >
          ENTRY 734を応援する
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>
        <a
          href="#links"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper-card px-4 text-sm font-semibold text-sage-deep"
        >
          SNS
        </a>
      </div>
    </div>
  );
}
