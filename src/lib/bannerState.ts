/**
 * バナー表示状態を決める純粋関数。
 *
 * 断定しないためのルール:
 * - 「ただいま配信中」は live.state === "live" のときだけ。
 *   予定時刻を過ぎただけの枠を「配信中」に昇格させない。
 *   unknown を live にも offline にも変換しない。
 * - ラジオは **fresh な** onAirConfirmed === true のときだけ「放送中」。
 *   時間帯だけなら状態ラベルも「放送時間」に留める（最終レンダー文字列全体で
 *   断定しない）。
 * - milyAppearanceConfirmed が true でない限り、本人がその時間に話していると
 *   読める書き方をしない（番組が放送中である、までしか言わない）。
 *
 * 放送枠のフェーズは **API レスポンスに保存された値ではなく現在時刻から再導出**する。
 * API が 09:59 の値を返したまま止まっても、13:00 には IDLE になる。
 */
import {
  isOnAirObservationStale,
  radioProgram,
  schedulePhase,
} from "../../shared/radio-program.js";
import type { RadioStatus } from "../data/radio";
import {
  formatSlotTimeRange,
  type StreamSlot,
} from "../data/streamSchedule.ts";

export type LiveState = "live" | "offline" | "unknown";

export type RealtimeLive = {
  state: LiveState;
  roomUrl: string | null;
  next?: { state: "scheduled" | "none" | "unknown"; at: string | null };
};

/** 番組そのものの状態（本人出演の有無とは別） */
export type ProgramState =
  | "PROGRAM_WINDOW"
  | "PROGRAM_TODAY"
  | "IDLE"
  | "UNKNOWN";

/** Mily 本人の出演確度 */
export type AppearanceState =
  | "APPEARANCE_CONFIRMED"
  | "LISTED_PERSONALITY"
  | "UNKNOWN";

export type BannerKind =
  | "SHOWROOM_LIVE"
  | "SHOWROOM_TODAY"
  | "RADIO_PROGRAM_WINDOW"
  | "RADIO_PROGRAM_TODAY"
  | "NONE";

export type BannerState = {
  kind: BannerKind;
  /** 色に頼らず状態を伝える短いラベル。断定度に応じて変える。 */
  stateLabel: string;
  title: string;
  /** 補足（時刻など）。2行目に出す。 */
  detail?: string;
  href?: string;
  linkLabel?: string;
  /** 支援情報: TodayDashboard 側の重複抑制に使う */
  slot?: StreamSlot;
};

const NONE: BannerState = { kind: "NONE", stateLabel: "", title: "" };

/**
 * 番組の放送枠フェーズ。**現在時刻から再導出**する。
 *
 * API レスポンスの `schedulePhase` / `inScheduledWindow` / `todayScheduled` は
 * 取得時点のスナップショットにすぎず、API が停止すると古いまま残る。
 * 放送枠（日曜 10:00-13:00 JST）は確定事実なので、時計から再計算すれば
 * 13:00 を過ぎた瞬間に IDLE、10:00 を過ぎた瞬間に WINDOW にできる。
 */
export function programState(
  _radio: RadioStatus | null = null,
  now: number = Date.now(),
): ProgramState {
  let phase: ReturnType<typeof schedulePhase>;
  try {
    phase = schedulePhase(now);
  } catch {
    // Asia/Tokyo が読めない環境では放送枠を主張しない
    return "UNKNOWN";
  }
  if (phase === "window") return "PROGRAM_WINDOW";
  if (phase === "upcoming") return "PROGRAM_TODAY";
  return "IDLE";
}

/**
 * 「いま番組が流れている」と言い切れるか。
 * 放送枠に入っていて、かつ **fresh な** onAirConfirmed === true のときだけ true。
 */
export function onAirConfirmedFresh(
  radio: RadioStatus | null,
  now: number = Date.now(),
): boolean {
  if (!radio || radio.onAirConfirmed !== true) return false;
  return !isOnAirObservationStale(radio.updatedAt, now);
}

export function appearanceState(radio: RadioStatus | null): AppearanceState {
  // 現状 milyAppearanceConfirmed は null 固定。将来 true を返すようになっても
  // 動くよう unknown 経由で比較する。
  const confirmed: unknown = radio?.milyAppearanceConfirmed;
  if (confirmed === true) return "APPEARANCE_CONFIRMED";
  // スタッフページに担当として記載があることは確認済みだが、
  // その時間に本人が話しているかは別（断定しない）。
  return "LISTED_PERSONALITY";
}

function slotStartMs(slot: StreamSlot): number {
  return new Date(`${slot.date}T${slot.time}:00+09:00`).getTime();
}

export function tokyoToday(now: number = Date.now()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(
    new Date(now),
  );
}

/** 今日の「これから始まる」最も早い配信枠。過ぎた枠は返さない。 */
export function nextTodaySlot(
  slots: StreamSlot[],
  now: number = Date.now(),
): StreamSlot | null {
  const today = tokyoToday(now);
  return (
    slots
      .filter((slot) => slot.date === today && slotStartMs(slot) > now)
      .sort((a, b) => slotStartMs(a) - slotStartMs(b))[0] ?? null
  );
}

/**
 * 今日のラジオ開始時刻（JST）。開始前でなければ null。
 * 開始時刻は確定事実なので、API が無くても shared の値から出せる。
 */
export function radioStartMs(
  radio: RadioStatus | null,
  now: number = Date.now(),
): number | null {
  if (programState(radio, now) !== "PROGRAM_TODAY") return null;
  // API が返した nextStartAt を優先（JST 計算はサーバ側に一本化）
  if (radio?.nextStartAt) {
    const parsed = Date.parse(radio.nextStartAt);
    if (!Number.isNaN(parsed)) return parsed;
  }
  const start = new Date(
    `${tokyoToday(now)}T${radio?.scheduledStart ?? radioProgram.scheduledStart}:00+09:00`,
  ).getTime();
  return Number.isNaN(start) ? null : start;
}

function showroomLiveBanner(live: RealtimeLive): BannerState | null {
  if (live.state !== "live" || !live.roomUrl) return null;
  return {
    kind: "SHOWROOM_LIVE",
    stateLabel: "配信中",
    title: "ただいまSHOWROOMで配信中！",
    href: live.roomUrl,
    linkLabel: "いますぐ見る",
  };
}

/**
 * 放送枠のバナー。
 * 放送枠は時刻から確定できるので radio が null でも出せるが、
 * **「放送中」と言い切るのは fresh な onAirConfirmed === true のときだけ**。
 * それ以外は状態ラベルもタイトルも「放送時間」に留める。
 */
function radioWindowBanner(
  radio: RadioStatus | null,
  now: number,
): BannerState | null {
  if (programState(radio, now) !== "PROGRAM_WINDOW") return null;
  const program = `「${radio?.programName ?? radioProgram.programName}」`;
  const confirmed = onAirConfirmedFresh(radio, now);
  return {
    kind: "RADIO_PROGRAM_WINDOW",
    stateLabel: confirmed ? "放送中" : "放送時間",
    title: confirmed
      ? `みりぃの担当番組${program}放送中！`
      : `${program}の放送時間です`,
    href: radio?.listenUrl ?? radioProgram.listenUrl,
    linkLabel: "ラジオを聴く",
  };
}

function showroomTodayBanner(
  live: RealtimeLive,
  slots: StreamSlot[],
  now: number,
): BannerState | null {
  const slot = nextTodaySlot(slots, now);
  if (!slot) return null;
  return {
    kind: "SHOWROOM_TODAY",
    stateLabel: "予定",
    title: "今日の配信",
    detail: `${formatSlotTimeRange(slot)} 予定`,
    href: live.roomUrl ?? "/support/",
    linkLabel: live.roomUrl ? "SHOWROOMを見る" : "配信予定を見る",
    slot,
  };
}

function radioTodayBanner(
  radio: RadioStatus | null,
  now: number,
): BannerState | null {
  if (programState(radio, now) !== "PROGRAM_TODAY") return null;
  const start = radio?.scheduledStart ?? radioProgram.scheduledStart;
  return {
    kind: "RADIO_PROGRAM_TODAY",
    stateLabel: "予定",
    title: `今日${start}〜 みりぃの担当番組`,
    detail: `「${radio?.programName ?? radioProgram.programName}」`,
    href: radio?.listenUrl ?? radioProgram.listenUrl,
    linkLabel: "番組を見る",
  };
}

/**
 * TodayDashboard が ActivityBanner と重複しないための表示判定（純粋関数）。
 *
 * - バナーが同じ配信を出しているなら、行も CTA も繰り返さない
 * - 開始時刻を過ぎた枠を「次回配信」とは呼ばない（矛盾するため）。
 *   実ライブが確認できたわけでもないので「配信予定時刻」に留める
 */
export function dashboardDisplay(input: {
  banner: BannerState;
  hasNextSlot: boolean;
  /** バナーが指しているのと同じ枠か */
  bannerShowsSameSlot: boolean;
  nextSlotStatus: string | null;
  showroomUrl: string | null;
}): {
  showNextStream: boolean;
  nextStreamLabel: string | null;
  showShowroomCta: boolean;
} {
  const bannerShowsThisSlot =
    input.banner.kind === "SHOWROOM_LIVE" ||
    (input.banner.kind === "SHOWROOM_TODAY" && input.bannerShowsSameSlot);
  const showNextStream = input.hasNextSlot && !bannerShowsThisSlot;

  // 同じ SHOWROOM 導線をバナーが出しているなら完全な重複なので出さない
  const bannerShowsShowroomCta =
    (input.banner.kind === "SHOWROOM_LIVE" ||
      input.banner.kind === "SHOWROOM_TODAY") &&
    Boolean(input.showroomUrl) &&
    input.banner.href === input.showroomUrl;

  return {
    showNextStream,
    nextStreamLabel: showNextStream
      ? input.nextSlotStatus === "past-start"
        ? "配信予定時刻"
        : "次回配信"
      : null,
    showShowroomCta: Boolean(input.showroomUrl) && !bannerShowsShowroomCta,
  };
}

/**
 * 表示するバナーを1件決める。
 * 1. SHOWROOM 実ライブ
 * 2. ラジオ放送時間帯（進行中）
 * 3. 今日の未来予定のうち開始が早いもの
 * 4. 同時刻なら SHOWROOM
 * 5. NONE
 */
export function deriveBannerState(
  input: {
    live: RealtimeLive;
    radio: RadioStatus | null;
    slots: StreamSlot[];
  },
  now: number = Date.now(),
): BannerState {
  const live = showroomLiveBanner(input.live);
  if (live) return live;

  const radioWindow = radioWindowBanner(input.radio, now);
  if (radioWindow) return radioWindow;

  const showroomToday = showroomTodayBanner(input.live, input.slots, now);
  const radioToday = radioTodayBanner(input.radio, now);

  if (showroomToday && radioToday) {
    const slotMs = showroomToday.slot ? slotStartMs(showroomToday.slot) : Infinity;
    const radioMs = radioStartMs(input.radio, now) ?? Infinity;
    // 同時刻なら SHOWROOM を優先
    return slotMs <= radioMs ? showroomToday : radioToday;
  }

  return showroomToday ?? radioToday ?? NONE;
}
