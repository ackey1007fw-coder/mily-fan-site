import { deriveBannerState, type BannerKind } from "../lib/bannerState";
import { useMilyRealtimeStatus } from "../lib/useMilyRealtimeStatus";
import { useStreamSchedule } from "../lib/useStreamSchedule";
import { ExternalLink } from "./ExternalLink";

/** JCBAインターネットサイマルラジオのFM湘南マジックウェイブ聴取ページ。 */
const RADIO_PLAYER_URL = "https://www.jcbasimul.com/magicwave";

/**
 * ページ最上部の即時ステータス（非 sticky）。
 * 「いま」または「今日の最優先1件」だけを出す。
 * 出すものが無ければ要素ごと描画しない。
 */
const STYLES: Record<Exclude<BannerKind, "NONE">, { box: string; mark: string }> = {
  SHOWROOM_LIVE: {
    box: "border-rose-300 bg-rose-50 text-rose-900",
    mark: "bg-rose-500 motion-safe:animate-pulse",
  },
  RADIO_PROGRAM_WINDOW: {
    box: "border-apricot/60 bg-apricot-soft text-apricot-ink",
    mark: "bg-apricot-ink",
  },
  SHOWROOM_TODAY: {
    box: "border-sage/30 bg-sage-soft text-sage-deep",
    mark: "bg-sage",
  },
  RADIO_PROGRAM_TODAY: {
    box: "border-apricot/40 bg-apricot-soft/70 text-apricot-ink",
    mark: "bg-apricot",
  },
};

// 色だけで状態を伝えないためのラベルは BannerState.stateLabel が持つ。
// kind だけでは断定度が決まらない（放送枠に入っていても、NOW ON AIR を
// 確認できていなければ「放送中」ではなく「放送時間」）ため、ここに固定表を
// 置かない。

export function ActivityBanner() {
  const { live, radio } = useMilyRealtimeStatus();
  const { slots } = useStreamSchedule();
  const banner = deriveBannerState({ live, radio, slots });

  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {banner.kind === "NONE" ? null : (
        <div className="px-4 pt-3">
          <div className="mx-auto max-w-3xl">
            {(() => {
              const style = STYLES[banner.kind];
              // ラジオのCTAは情報ページではなく、すぐ聴けるJCBAの配信ページへ送る。
              const href =
                banner.kind === "RADIO_PROGRAM_WINDOW" ||
                banner.kind === "RADIO_PROGRAM_TODAY"
                  ? RADIO_PLAYER_URL
                  : banner.href;
              const isAnchor = href?.startsWith("#") ?? false;
              const content = (
                <>
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.mark}`}
                  />
                  {/* 320px でも文字がリンクに重ならないよう、
                      本文は最低幅を持ち、足りなければリンクを次の行へ送る。 */}
                  <span className="min-w-0 grow basis-48 leading-snug [overflow-wrap:anywhere]">
                    <span className="mr-2 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold">
                      {banner.stateLabel}
                    </span>
                    <span className="text-sm font-semibold">{banner.title}</span>
                    {banner.detail ? (
                      <span className="ml-1 text-sm font-semibold">{banner.detail}</span>
                    ) : null}
                  </span>
                  <span className="ml-auto shrink-0 text-xs font-semibold underline">
                    {banner.linkLabel}
                  </span>
                </>
              );
              const className = `flex min-h-11 flex-wrap items-center gap-x-2.5 gap-y-1 rounded-2xl border px-3 py-2 sm:flex-nowrap sm:px-4 ${style.box}`;

              return isAnchor ? (
                <a href={href} className={className}>
                  {content}
                </a>
              ) : (
                <ExternalLink href={href ?? "#"} className={className}>
                  {content}
                </ExternalLink>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
