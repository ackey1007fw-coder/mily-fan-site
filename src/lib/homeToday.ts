/**
 * ホーム（`/`）用の薄いprojection。
 *
 * 「今日」「今」の意味は `/support/` と同じ `selectSupportToday()` /
 * `selectSupportNow()` に一本化し、ここでは **ホーム固有の表示調整だけ** を行う。
 *
 * 1. 重複抑制: ホーム最上部の `ActivityBanner` が既に同じSHOWROOM LIVE /
 *    ラジオ番組枠を出しているとき、そのすぐ下の TodayDashboard で
 *    同じ内容・同じCTAを繰り返さない。
 *    ただし抑制するのは **バナーと同じ行き先** の導線だけ。バナーが
 *    `#stream`（ページ内anchor）へ退避しているのに項目側が直接のSHOWROOM URLを
 *    持っている場合、そのCTAはバナーが提供していない導線なので残す。
 * 2. NOWの件数制限: `docs/ACTIVITIES-SUPPORT-DESIGN.md` 9.5 の
 *    「トップに巨大なCalendarを置かず、NOW最大2件と `/support/` 導線に留める」に従い、
 *    ホームのNOWは決定的な優先順位で最大2件へ絞る。
 *    `/support/` は `selectSupportNow()` を直接使い続けるので全件のまま。
 * 3. 確認済みSHOWROOM導線のfallback: schedule / live APIが取得できない、または
 *    今日の枠が無いときでも、`socials.ts` の確認済みSHOWROOM URLへは行けるようにする。
 *    どこか（バナー / today / now / retainedActions）が既にSHOWROOMへ送っている
 *    ときは足さない。取得できないことを「予定なし」とは書かない。
 *
 * ここで新しい事実・新しい日程・新しい状態ラベルを作らない。
 * Support側のsemanticsを変えず、表示するかどうかだけを決める純粋関数。
 */
import type { Contest } from "../data/contest.ts";
import type { RadioStatus, SchedulePhase } from "../data/radio.ts";
import { socials } from "../data/socials.ts";
import type { StreamSlot } from "../data/streamSchedule.ts";
import type { SupportEvent } from "../data/supportEvents.ts";
import type { BannerState } from "./bannerState.ts";
import type { LiveView } from "./realtimeStore.ts";
import {
  selectSupportNow,
  selectSupportToday,
  type SupportAction,
  type SupportNowItem,
  type SupportTodayItem,
} from "./supportHub.ts";

export type HomeTodayView = {
  todayItems: SupportTodayItem[];
  nowItems: SupportNowItem[];
  /**
   * バナーに抑制された項目が持っていた導線のうち、
   * **バナーが提供していない行き先**だけを残したもの。
   * 行そのものは重複するので出さず、CTAだけを拾う。
   */
  retainedActions: SupportAction[];
  /**
   * どこもSHOWROOMへ送っていないときだけ足す、確認済みのfallback導線。
   * URLは `socials.ts` が正本。ここで新しいURLを持たない。
   */
  fallbackActions: SupportAction[];
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

/**
 * 抑制された「今日」の項目から、バナーが提供していない導線だけを拾う。
 *
 * `SHOWROOM_TODAY` バナーは `live.roomUrl` が未取得だと `#stream`
 * （ページ内anchor）へ退避する。一方 `selectSupportToday()` は
 * schedule API が解決した room URL を使うので、同じ枠を指していても
 * **行き先が違う**ことがある。この場合に直接のSHOWROOM導線まで消さない。
 *
 * ラジオはバナー側が即時に聴けるプレイヤーへ送る役割を持っており、
 * 番組枠の項目CTAと役割が重なるので、ここでは拾わない
 * （同じ「ラジオを聴く」を2つ並べない）。
 */
export function retainedTodayActions(
  banner: BannerState,
  suppressed: SupportTodayItem[],
): SupportAction[] {
  const seen = new Set<string>();
  const actions: SupportAction[] = [];

  for (const item of suppressed) {
    // SHOWROOM導線だけが対象。行き先が同じならバナーとの完全な重複なので出さない。
    if (item.activityId !== "live-stream") continue;
    if (!item.cta || item.cta.url === banner.href) continue;
    if (seen.has(item.cta.url)) continue;
    seen.add(item.cta.url);
    actions.push(item.cta);
  }

  return actions;
}

/**
 * `socials.ts` の確認済みSHOWROOM導線。URLの正本は `socials.ts` だけで、
 * ここには持たない。未登録なら null（推測して作らない）。
 */
export function confirmedShowroomAction(): SupportAction | null {
  const entry = socials.find(({ platform }) => platform === "showroom");
  return entry ? { label: "SHOWROOMで見る", url: entry.url } : null;
}

function sameOrigin(a: string, b: string): boolean {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    // `#stream` のようなページ内anchorはURLとして解決できない = 別の行き先。
    return false;
  }
}

/**
 * 確認済みSHOWROOM導線をfallbackとして足すか決める。
 *
 * バナー・today・now・retainedActions のどれかが既にSHOWROOMへ送っているなら
 * 足さない（同じ場所へのボタンを2つ並べない）。判定はURL完全一致ではなく
 * originで見る。API解決のroom URLと確認済みURLはpathが違うことがあり、
 * どちらもSHOWROOMへ送る以上、並べる意味がないため。
 *
 * schedule / live APIが取得できない、または今日の枠が無いというだけでは
 * SHOWROOM導線を消さない。取得できないことは「予定なし」ではない。
 */
export function fallbackShowroomActions(input: {
  banner: BannerState;
  todayItems: SupportTodayItem[];
  nowItems: SupportNowItem[];
  retainedActions: SupportAction[];
}): SupportAction[] {
  const confirmed = confirmedShowroomAction();
  if (!confirmed) return [];

  const offered = [
    input.banner.href,
    ...input.todayItems.map((item) => item.cta?.url),
    ...input.nowItems.map((item) => item.cta?.url),
    ...input.retainedActions.map((action) => action.url),
  ].filter((url): url is string => typeof url === "string");

  return offered.some((url) => sameOrigin(url, confirmed.url))
    ? []
    : [confirmed];
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
  const allTodayItems = selectSupportToday({
    contest: input.contest,
    streamSlots: input.streamSlots,
    streamRoomUrl: input.streamRoomUrl,
    liveRoomUrl: input.live.roomUrl,
    radioPhase: input.radioPhase,
    now: input.now,
  });
  const covered = (item: SupportTodayItem) =>
    bannerCoversTodayItem(input.banner, item);
  const todayItems = allTodayItems.filter((item) => !covered(item));
  const retainedActions = retainedTodayActions(
    input.banner,
    allTodayItems.filter(covered),
  );

  // バナーで抑制したあとに上限を適用する。抑制で消えた枠は残りの項目が使う。
  const nowItems = rankHomeNowItems(
    selectSupportNow({
      supportEvents: input.supportEvents,
      live: input.live,
      radio: input.radio,
      now: input.now,
    }).filter((item) => !bannerCoversNowItem(input.banner, item)),
  ).slice(0, HOME_NOW_LIMIT);

  const fallbackActions = fallbackShowroomActions({
    banner: input.banner,
    todayItems,
    nowItems,
    retainedActions,
  });

  return { todayItems, nowItems, retainedActions, fallbackActions };
}
