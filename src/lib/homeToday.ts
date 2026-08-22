/**
 * ホーム（`/`）用の薄いprojection。
 *
 * 「今日」「今」の意味は `/support/` と同じ `selectSupportToday()` /
 * `selectSupportNow()` に一本化し、ここでは **ホーム固有の表示調整だけ** を行う。
 *
 * 1. 重複抑制: ホーム最上部の `ActivityBanner` が既に同じSHOWROOM LIVE /
 *    ラジオ番組枠を出しているとき、そのすぐ下の TodayDashboard で
 *    同じ内容・同じCTAを繰り返さない。
 * 2. NOWの件数制限: `docs/ACTIVITIES-SUPPORT-DESIGN.md` 9.5 の
 *    「トップに巨大なCalendarを置かず、NOW最大2件と `/support/` 導線に留める」に従い、
 *    ホームのNOWは決定的な優先順位で最大2件へ絞る。
 *    `/support/` は `selectSupportNow()` を直接使い続けるので全件のまま。
 *
 * ここで新しい事実・新しい日程・新しい状態ラベルを作らない。
 * Support側のsemanticsを変えず、表示するかどうかだけを決める純粋関数。
 */
import type { Contest } from "../data/contest.ts";
import type { RadioStatus, SchedulePhase } from "../data/radio.ts";
import type { StreamSlot } from "../data/streamSchedule.ts";
import type { SupportEvent } from "../data/supportEvents.ts";
import type { BannerState } from "./bannerState.ts";
import type { LiveView } from "./realtimeStore.ts";
import {
  selectSupportNow,
  selectSupportToday,
  type SupportNowItem,
  type SupportTodayItem,
} from "./supportHub.ts";

export type HomeTodayView = {
  todayItems: SupportTodayItem[];
  nowItems: SupportNowItem[];
};

/** compactなホームNOWの上限（design 9.5「NOW最大2件」）。 */
export const HOME_NOW_LIMIT = 2;

/**
 * ホームNOWの表示優先度。小さいほど先に出す。
 *
 * いま見る / いま聴かないと終わるrealtime項目を先に出し、
 * 複数日にまたがることがある応援期間はその次にする。
 * 件数が上限を超えても、同じ入力からは常に同じ2件が選ばれる。
 */
const NOW_ORIGIN_PRIORITY: Record<SupportNowItem["origin"], number> = {
  "showroom-live": 0,
  "radio-program": 1,
  "support-event": 2,
};

/**
 * originの優先度で安定ソートする。
 * 同じorigin同士は `selectSupportNow()` が返した順序をそのまま保つ
 * （`Array.prototype.sort` はstableなので、並べ替えは決定的）。
 */
export function rankHomeNowItems(items: SupportNowItem[]): SupportNowItem[] {
  return [...items].sort(
    (a, b) => NOW_ORIGIN_PRIORITY[a.origin] - NOW_ORIGIN_PRIORITY[b.origin],
  );
}

/** バナーが既に出している「今日」の項目か。 */
export function bannerCoversTodayItem(
  banner: BannerState,
  item: SupportTodayItem,
): boolean {
  if (item.activityId === "live-stream") {
    if (banner.kind === "SHOWROOM_LIVE") return true;
    return (
      banner.kind === "SHOWROOM_TODAY" &&
      banner.slot !== undefined &&
      item.key === todayShowroomKey(banner.slot)
    );
  }
  if (item.activityId === "radio") {
    return (
      banner.kind === "RADIO_PROGRAM_WINDOW" ||
      banner.kind === "RADIO_PROGRAM_TODAY"
    );
  }
  // コンテストの審査段階はバナーの担当ではないので抑制しない。
  return false;
}

/** バナーが既に出している「今」の項目か。 */
export function bannerCoversNowItem(
  banner: BannerState,
  item: SupportNowItem,
): boolean {
  if (item.origin === "showroom-live") return banner.kind === "SHOWROOM_LIVE";
  if (item.origin === "radio-program") {
    return banner.kind === "RADIO_PROGRAM_WINDOW";
  }
  return false;
}

/** `selectSupportToday()` が配信枠に使うkeyと同じ規則。 */
function todayShowroomKey(slot: StreamSlot): string {
  return `today:showroom:${slot.date}T${slot.time}`;
}

export function selectHomeToday(input: {
  contest: Contest;
  supportEvents: SupportEvent[];
  streamSlots: StreamSlot[];
  streamRoomUrl: string | null;
  live: LiveView;
  radio: RadioStatus | null;
  radioPhase: SchedulePhase;
  banner: BannerState;
  now: number;
}): HomeTodayView {
  const todayItems = selectSupportToday({
    contest: input.contest,
    streamSlots: input.streamSlots,
    streamRoomUrl: input.streamRoomUrl,
    liveRoomUrl: input.live.roomUrl,
    radioPhase: input.radioPhase,
    now: input.now,
  }).filter((item) => !bannerCoversTodayItem(input.banner, item));

  // バナーで抑制したあとに上限を適用する。抑制で消えた枠は残りの項目が使う。
  const nowItems = rankHomeNowItems(
    selectSupportNow({
      supportEvents: input.supportEvents,
      live: input.live,
      radio: input.radio,
      now: input.now,
    }).filter((item) => !bannerCoversNowItem(input.banner, item)),
  ).slice(0, HOME_NOW_LIMIT);

  return { todayItems, nowItems };
}
