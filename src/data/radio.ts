/**
 * FM湘南マジックウェイブ「湘南シーサイドサークル」。
 *
 * **事実と時間判定の実体は `shared/radio-program.js`（単一 source of truth）。**
 * ここは型付けと再エクスポートだけを行う。番組名・曜日・時刻・URL を
 * このファイルに書き足さないこと（API 側と食い違う原因になる）。
 *
 * How to use: docs/CONTENT-OPS.md
 */
export {
  RADIO_TIMEZONE,
  isBroadcastDay,
  isInScheduledWindow,
  minutesFromMidnight,
  nextStartAtIso,
  parseHm,
  programNameMatches,
  radioProgram,
  schedulePhase,
  scheduledFlags,
  tokyoClock,
  tokyoDate,
} from "../../shared/radio-program.js";

/** 放送日の中での位置。放送日でなければ "idle"。 */
export type SchedulePhase = "upcoming" | "window" | "ended" | "idle";

/**
 * NOW ON AIR の確認結果。
 * - true: トップページの NOW ON AIR 番組名が明確に一致
 * - false: 取得でき、別番組または NOT ON AIR と読めた
 * - null: 取得失敗・HTML変更・曖昧（unavailable）
 */
export type OnAirConfirmed = true | false | null;

export type RadioStatus = {
  ok: boolean;
  programName: string;
  todayScheduled: boolean;
  scheduledStart: string;
  scheduledEnd: string;
  inScheduledWindow: boolean;
  /** 13:00 以降に「今日10:00〜」を出さないための位置情報。 */
  schedulePhase: SchedulePhase;
  /** 今日これから始まる場合のみ ISO。それ以外は null。 */
  nextStartAt: string | null;
  onAirConfirmed: OnAirConfirmed;
  /** 時間帯や NOW ON AIR だけでは本人出演を確定しない。現状は常に null。 */
  milyAppearanceConfirmed: null;
  listenUrl: string;
  sourceUrl: string;
  /** 番組情報を一次ソースで確認した日 (YYYY-MM-DD)。 */
  lastVerifiedAt: string;
  updatedAt: string;
};

export type TokyoClock = {
  weekday: number;
  hour: number;
  minute: number;
};
