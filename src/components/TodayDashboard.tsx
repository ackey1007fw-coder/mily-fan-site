import { contest } from "../data/contest";
import { socials } from "../data/socials";
import { supportEvents } from "../data/supportEvents";
import { deriveBannerState } from "../lib/bannerState";
import { selectHomeToday } from "../lib/homeToday";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { useMilyRealtimeStatus } from "../lib/useMilyRealtimeStatus";
import { useStreamSchedule } from "../lib/useStreamSchedule";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { ExternalLink } from "./ExternalLink";

const SNS_PLATFORMS = ["x", "instagram", "tiktok"] as const;

const snsLabel: Record<string, string> = {
  x: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
};

const itemCta =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft";

const primaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep";

const secondaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft";

/**
 * 「今日のみりぃ」— サイトを開いた瞬間に状況を把握するcompact dashboard。
 *
 * 「今日」「今」の意味は `/support/` と同じ Support domain selector
 * （`selectSupportToday()` / `selectSupportNow()`）から取り、ホーム側では
 * `selectHomeToday()` で ActivityBanner との重複だけを抑制する。
 * 確認できていないもの（配信の終了時刻、本人の出演時間、未取得の予定）は
 * 表示しない。API を取得できなかったことを「予定なし」に変換もしない。
 *
 * live region は最上部の ActivityBanner が1つだけ持つ。同じrealtime状態を
 * ここでも読み上げさせないため、このカードは live region にしない。
 */
export function TodayDashboard() {
  const now = useSupportEventClock();
  const { slots, roomUrl } = useStreamSchedule();
  const { live, radio, schedulePhase } = useMilyRealtimeStatus();

  const banner = deriveBannerState({ live, radio, slots });
  const {
    todayItems,
    nowItems,
    voteActions,
    dashboardVoteButtons,
    retainedActions,
    fallbackActions,
  } = selectHomeToday({
    contest,
    supportEvents,
    streamSlots: slots,
    streamRoomUrl: roomUrl,
    live,
    radio,
    radioPhase: schedulePhase,
    banner,
    now,
  });
  const [primaryVote] = voteActions;
  const liveVoteOnNow = nowItems.some(
    (item) => item.cta?.url === primaryVote.url,
  );
  const offeredUrls = new Set([
    ...nowItems.flatMap((item) => (item.cta ? [item.cta.url] : [])),
    ...dashboardVoteButtons.map((action) => action.url),
  ]);
  const secondaryActions = [...retainedActions, ...fallbackActions].filter(
    (action) => !offeredUrls.has(action.url),
  );

  const contestToday = todayItems.find((item) => item.key === "today:contest");
  const scheduleItems = todayItems.filter(
    (item) => item.key !== "today:contest",
  );
  const snsLinks = SNS_PLATFORMS.map((platform) =>
    socials.find((item) => item.platform === platform),
  ).filter((item) => item !== undefined);

  return (
    <section id="today" className={`${SECTION_ANCHOR_OFFSET} px-4 pb-4 pt-2`}>
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
          {contestToday ? (
            <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-sage-deep">
              {contestToday.value}
            </span>
          ) : null}
        </div>
        {contestToday?.note ? (
          <p className="mt-2 whitespace-pre-line text-xs leading-6 text-ink-muted">
            {contestToday.note}
          </p>
        ) : null}

        {scheduleItems.length > 0 ? (
          <ul className="mt-3 space-y-3 border-t border-sage/15 pt-3">
            {scheduleItems.map((item) => (
              <li key={item.key} className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm text-ink-muted">{item.label}</span>
                  <span className="text-base font-bold [overflow-wrap:anywhere] text-ink">
                    {item.value}
                  </span>
                </p>
                {item.note ? (
                  <p className="mt-1 text-xs leading-6 text-ink-muted">
                    {item.note}
                  </p>
                ) : null}
                {item.cta ? (
                  <p className="mt-2">
                    <ExternalLink href={item.cta.url} className={itemCta}>
                      {item.cta.label}
                    </ExternalLink>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {nowItems.length > 0 ? (
          <ul className="mt-3 space-y-3 border-t border-sage/15 pt-3">
            {nowItems.map((item) => {
              const isLiveVote =
                primaryVote.kind === "support-event" &&
                item.cta?.url === primaryVote.url;
              const isContestNowHero =
                primaryVote.kind === "contest" &&
                item.cta?.url === primaryVote.url;
              const isNowHero = isLiveVote || isContestNowHero;
              return (
                <li
                  key={item.key}
                  className={
                    isNowHero
                      ? "min-w-0 rounded-2xl border-2 border-apricot bg-apricot-soft p-4 shadow-card"
                      : "min-w-0 rounded-2xl border border-apricot/50 bg-apricot-soft/40 p-3"
                  }
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-apricot-ink">
                    {isLiveVote
                      ? "投票受付中"
                      : isContestNowHero
                        ? "今これ"
                        : "現在進行中を確認"}
                  </p>
                  <p className="mt-1 text-base font-bold [overflow-wrap:anywhere] text-ink">
                    {item.title}
                  </p>
                  {item.note ? (
                    <p className="mt-1 whitespace-pre-line text-xs leading-6 text-ink-muted">
                      {item.note}
                    </p>
                  ) : null}
                  {item.cta ? (
                    <p className="mt-2">
                      <ExternalLink
                        href={item.cta.url}
                        className={isNowHero ? primaryCta : itemCta}
                      >
                        {item.cta.label}
                      </ExternalLink>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}

        {/*
          `/support/` への導線は、すぐ下の compact Support gateway が担当する。
          同じCTAを上下で繰り返さない。

          期間中の投票は nowItems の目立つカードが担当する。同じURLを下の行へ重ねない。
          常設の MISS CIRCLE ENTRY は期間中もボタン行に残す。Paton が終わったあとは
          3次審査を NOW の「今これ」にし、同じ ENTRY をボタン行へ重ねない。

          secondaryActions は、バナーが同じ枠を出していて行だけ抑制した項目のうち
          バナーが提供していない行き先（例: バナーが `#stream` に退避している間の
          直接のSHOWROOM URL）と、どこもSHOWROOMへ送っていないときに足す
          `socials.ts` の確認済みfallback。行き先が同じ導線はここには来ない。
        */}
        {dashboardVoteButtons.length > 0 || secondaryActions.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {dashboardVoteButtons.map((action, index) => (
              <ExternalLink
                key={action.url}
                href={action.url}
                className={
                  !liveVoteOnNow && index === 0 ? primaryCta : secondaryCta
                }
              >
                {action.label}
              </ExternalLink>
            ))}
            {secondaryActions.map((action) => (
              <ExternalLink
                key={action.url}
                href={action.url}
                className={secondaryCta}
              >
                {action.label}
              </ExternalLink>
            ))}
          </div>
        ) : null}

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
