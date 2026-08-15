/**
 * バナー表示状態を決める純粋関数（import は型のみ = ランタイム依存なし）。
 *
 * 断定しないためのルール:
 * - 「ただいま配信中」は live.state === "live" のときだけ。
 *   予定時刻を過ぎただけの枠を「配信中」に昇格させない。
 *   unknown を live にも offline にも変換しない。
 * - ラジオは onAirConfirmed === true のときだけ「放送中」。
 *   時間帯だけなら「放送時間です」に留める。
 * - milyAppearanceConfirmed が true でない限り、本人がその時間に話していると
 *   読める書き方をしない（番組が放送中である、までしか言わない）。
 */
import type { RadioStatus } from "../data/radio";
import type { StreamSlot } from "../data/streamSchedule";

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
  title: string;
  /** 補足（時刻など）。2行目に出す。 */
  detail?: string;
  href?: string;
  linkLabel?: string;
  /** 支援情報: TodayDashboard 側の重複抑制に使う */
  slot?: StreamSlot;
};

const NONE: BannerState = { kind: "NONE", title: "" };

export function programState(radio: RadioStatus | null): ProgramState {
  if (!radio) return "UNKNOWN";
  if (radio.inScheduledWindow === true) return "PROGRAM_WINDOW";
  // 13:00 を過ぎた放送日に「今日10:00〜」を出さない。
  // schedulePhase が無い古いレスポンスでも、開始前だけを PROGRAM_TODAY とする。
  if (radio.schedulePhase === "upcoming") return "PROGRAM_TODAY";
  if (radio.schedulePhase === undefined && radio.todayScheduled === true) {
    return "PROGRAM_TODAY";
  }
  return "IDLE";
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

/** 今日のラジオ開始時刻（JST）。放送日でなければ null。 */
export function radioStartMs(
  radio: RadioStatus | null,
  now: number = Date.now(),
): number | null {
  if (programState(radio) !== "PROGRAM_TODAY" || !radio) return null;
  // API が返した nextStartAt を優先（JST 計算はサーバ側に一本化）
  if (radio.nextStartAt) {
    const parsed = Date.parse(radio.nextStartAt);
    if (!Number.isNaN(parsed)) return parsed;
  }
  const start = new Date(
    `${tokyoToday(now)}T${radio.scheduledStart}:00+09:00`,
  ).getTime();
  return Number.isNaN(start) ? null : start;
}

function showroomLiveBanner(live: RealtimeLive): BannerState | null {
  if (live.state !== "live" || !live.roomUrl) return null;
  return {
    kind: "SHOWROOM_LIVE",
    title: "ただいまSHOWROOMで配信中！",
    href: live.roomUrl,
    linkLabel: "いますぐ見る",
  };
}

function radioWindowBanner(radio: RadioStatus | null): BannerState | null {
  if (!radio || programState(radio) !== "PROGRAM_WINDOW") return null;
  const program = `「${radio.programName}」`;
  const confirmed = radio.onAirConfirmed === true;
  return {
    kind: "RADIO_PROGRAM_WINDOW",
    title: confirmed
      ? `みりぃの担当番組${program}放送中！`
      : `${program}の放送時間です`,
    href: radio.listenUrl,
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
    title: "今日の配信",
    detail: `${slot.time}〜 予定`,
    href: live.roomUrl ?? "#stream",
    linkLabel: live.roomUrl ? "SHOWROOMを見る" : "配信予定を見る",
    slot,
  };
}

function radioTodayBanner(radio: RadioStatus | null): BannerState | null {
  if (!radio || programState(radio) !== "PROGRAM_TODAY") return null;
  return {
    kind: "RADIO_PROGRAM_TODAY",
    title: `今日${radio.scheduledStart}〜 みりぃの担当番組`,
    detail: `「${radio.programName}」`,
    href: radio.listenUrl,
    linkLabel: "番組を見る",
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

  const radioWindow = radioWindowBanner(input.radio);
  if (radioWindow) return radioWindow;

  const showroomToday = showroomTodayBanner(input.live, input.slots, now);
  const radioToday = radioTodayBanner(input.radio);

  if (showroomToday && radioToday) {
    const slotMs = showroomToday.slot ? slotStartMs(showroomToday.slot) : Infinity;
    const radioMs = radioStartMs(input.radio, now) ?? Infinity;
    // 同時刻なら SHOWROOM を優先
    return slotMs <= radioMs ? showroomToday : radioToday;
  }

  return showroomToday ?? radioToday ?? NONE;
}
