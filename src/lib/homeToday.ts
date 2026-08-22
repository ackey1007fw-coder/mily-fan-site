/**
 * ホーム（`/`）用の薄いprojection。
 *
 * 「今日」「今」の意味は `/support/` と同じ `selectSupportToday()` /
 * `selectSupportNow()` に一本化し、ここでは **ホーム固有の重複抑制だけ** を行う。
 * ホーム最上部の `ActivityBanner` が既に同じSHOWROOM LIVE / ラジオ番組枠を
 * 出しているとき、そのすぐ下の TodayDashboard で同じ内容・同じCTAを繰り返さない。
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

  const nowItems = selectSupportNow({
    supportEvents: input.supportEvents,
    live: input.live,
    radio: input.radio,
    now: input.now,
  }).filter((item) => !bannerCoversNowItem(input.banner, item));

  return { todayItems, nowItems };
}
