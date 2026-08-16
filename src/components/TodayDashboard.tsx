import { contest } from "../data/contest";
import { socials } from "../data/socials";
import { dashboardDisplay, deriveBannerState } from "../lib/bannerState";
import { useMilyRealtimeStatus } from "../lib/useMilyRealtimeStatus";
import {
  formatSlotDate,
  slotStatus,
  useStreamSchedule,
} from "../lib/useStreamSchedule";
import { ExternalLink } from "./ExternalLink";

const SNS_PLATFORMS = ["x", "instagram", "tiktok"] as const;

const snsLabel: Record<string, string> = {
  x: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
};

/**
 * 「今日のみりぃ」— サイトを開いた瞬間に“今どう応援できるか”をまとめるカード。
 * 情報が存在しないもの（配信予定なし等）は表示しない。
 */
export function TodayDashboard() {
  const { slots, roomUrl } = useStreamSchedule();
  const { live, radio } = useMilyRealtimeStatus();
  const next = slots[0];
  const status = next ? slotStatus(next) : null;

  // ActivityBanner が同じ配信をすでに出しているときは、ここでは繰り返さない
  // （上下で同じ内容・CTA を重複させない）。判定は純粋関数に切り出してある。
  const banner = deriveBannerState({ live, radio, slots });

  // SHOWROOM導線: APIの解決結果を最優先、なければ確認済みの静的リンク
  const showroomStatic = socials.find((item) => item.platform === "showroom");
  const showroomUrl = live.roomUrl ?? roomUrl ?? showroomStatic?.url ?? null;

  const { showNextStream, nextStreamLabel, showShowroomCta } = dashboardDisplay({
    banner,
    hasNextSlot: Boolean(next),
    bannerShowsSameSlot:
      banner.slot?.date === next?.date && banner.slot?.time === next?.time,
    nextSlotStatus: status,
    showroomUrl,
  });
  const snsLinks = SNS_PLATFORMS.map((platform) =>
    socials.find((item) => item.platform === platform),
  ).filter((item) => item !== undefined);

  return (
    <section id="today" className="scroll-mt-24 px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-paper-card p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-ink">今日のみりぃ</h2>
          <p className="text-xs font-medium uppercase tracking-wide text-sage-deep">
            {contest.contestName}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-2xl font-bold tracking-tight text-ink">
            {contest.entryNumber}
          </p>
          {contest.currentPhase ? (
            <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-sage-deep">
              {contest.currentPhase.name}
            </span>
          ) : null}
        </div>

        {next && showNextStream ? (
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-sage/15 pt-3">
            <span className="text-sm text-ink-muted">{nextStreamLabel}</span>
            <span className="text-base font-bold text-ink">
              {formatSlotDate(next)} {next.time}〜
            </span>
            {status === "past-start" ? (
              <span className="rounded-full bg-apricot-ink px-2 py-0.5 text-xs font-semibold text-white">
                開始時刻を過ぎています
              </span>
            ) : status === "today" ? (
              <span className="rounded-full bg-sage px-2 py-0.5 text-xs font-semibold text-white">
                本日
              </span>
            ) : null}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <ExternalLink
            href={contest.entryUrl}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            ENTRY 734を応援する
          </ExternalLink>
          {showroomUrl && showShowroomCta ? (
            <ExternalLink
              href={showroomUrl}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
            >
              SHOWROOMで見る
            </ExternalLink>
          ) : null}
        </div>

        {snsLinks.length > 0 ? (
          <p className="mt-3 flex flex-wrap gap-2">
            {snsLinks.map((item) => (
              <ExternalLink
                key={item.id}
                href={item.url}
                className="inline-flex min-h-9 items-center rounded-full bg-sage-soft/70 px-3 py-1 text-xs font-semibold text-sage-deep hover:bg-sage-soft"
              >
                {snsLabel[item.platform] ?? item.platform}
              </ExternalLink>
            ))}
          </p>
        ) : null}
      </div>
    </section>
  );
}
