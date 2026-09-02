/**
 * 配信予定（手入力の fallback）。
 *
 * - 決まった予定をここに追記するだけで表示されます。未確認の予定は書かない。
 *   配信時刻を推測・捏造しない。空なら配信予定セクションは非表示になります。
 * - 三次審査の本人配布タイムテーブル（9/3–9/12）は確認済み枠だけを書く。
 *   9/7・9/10・9/8昼は未定／なしなので入れない。9/8夜の本人表記 24:00-25:00 は
 *   実時刻の 9/9 0:00 として入れる（`time` は 00:00–23:59 のみ）。
 * - 自動取得（/api/mily-schedule）が有効な場合は、手入力とマージされます。
 *   重複（同じ date+time）は手入力を優先します。
 * - 日付・時刻は JST。開始から約3時間で自動的に非表示になります。
 */
export type StreamSlot = {
  /** JSTの日付 "2026-08-16" */
  date: string;
  /** 24時間表記 "22:30" */
  time: string;
  /** 任意の補足（例:「特別配信」） */
  note?: string;
};

export const streamSchedule: StreamSlot[] = [
  { date: "2026-09-03", time: "07:30", note: "7:30-8:00" },
  { date: "2026-09-03", time: "14:40", note: "14:40-15:20" },
  { date: "2026-09-03", time: "21:00", note: "21:00-21:50" },
  { date: "2026-09-04", time: "07:00", note: "7:00-7:40" },
  { date: "2026-09-04", time: "14:50", note: "14:50-15:10" },
  { date: "2026-09-04", time: "22:30", note: "22:30-23:30" },
  { date: "2026-09-05", time: "09:00", note: "9:00-9:20" },
  { date: "2026-09-05", time: "14:30", note: "14:30-15:20" },
  { date: "2026-09-05", time: "21:00", note: "21:00-21:50" },
  { date: "2026-09-06", time: "05:30", note: "5:30-6:30" },
  { date: "2026-09-06", time: "14:40", note: "14:40-15:20" },
  { date: "2026-09-06", time: "22:30", note: "22:30-22:50" },
  { date: "2026-09-08", time: "07:00", note: "7:00-8:00" },
  {
    date: "2026-09-09",
    time: "00:00",
    note: "本人表記 24:00-25:00（9/9 0:00-1:00）",
  },
  { date: "2026-09-09", time: "10:00", note: "10:00-11:00" },
  { date: "2026-09-09", time: "14:40", note: "14:40-15:20" },
  { date: "2026-09-09", time: "21:30", note: "21:30-21:50" },
  { date: "2026-09-11", time: "10:00", note: "10:00-10:30" },
  { date: "2026-09-11", time: "14:50", note: "14:50-15:20" },
  { date: "2026-09-11", time: "21:00", note: "21:00-22:00" },
  { date: "2026-09-12", time: "08:00", note: "8:00-8:30" },
  { date: "2026-09-12", time: "14:40", note: "14:40-15:10" },
  { date: "2026-09-12", time: "21:00", note: "21:00-22:00" },
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** 開始からこの時間だけは「配信中」として表示に残す。 */
export const VISIBLE_AFTER_START_MS = 3 * 60 * 60 * 1000;

function isRealCalendarDate(value: string): boolean {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}

export function isValidSlot(slot: unknown): slot is StreamSlot {
  if (typeof slot !== "object" || slot === null) return false;
  const candidate = slot as Record<string, unknown>;
  if (typeof candidate.date !== "string" || !DATE_RE.test(candidate.date)) {
    return false;
  }
  if (!isRealCalendarDate(candidate.date)) return false;
  return typeof candidate.time === "string" && TIME_RE.test(candidate.time);
}

export function slotStartMs(slot: StreamSlot): number {
  return new Date(`${slot.date}T${slot.time}:00+09:00`).getTime();
}

/**
 * 手入力→自動取得の順でマージし、重複(date+time)は先勝ち（手入力優先）。
 * 不正な値は除外し、開始から約3時間を過ぎた予定は落とし、日時順に並べる。
 */
export function upcomingSlots(
  manual: StreamSlot[],
  auto: unknown[],
  now: number = Date.now(),
): StreamSlot[] {
  const merged = new Map<string, StreamSlot>();
  for (const slot of [...manual, ...auto]) {
    if (!isValidSlot(slot)) continue;
    const key = `${slot.date}T${slot.time}`;
    if (!merged.has(key)) merged.set(key, slot);
  }
  return [...merged.values()]
    .filter((slot) => slotStartMs(slot) + VISIBLE_AFTER_START_MS > now)
    .sort((a, b) => slotStartMs(a) - slotStartMs(b))
    // 三次審査の本人枠は23件。12件だと後半がカレンダーから落ちる。
    .slice(0, 32);
}
