import type { ContestPhase } from "../data/contest.ts";
import {
  missCircleThirdRoundShowroomReview,
  missCircleThirdRoundWebVote,
  type SupportEventSchedule,
} from "../data/supportEvents.ts";
import {
  formatShortTokyoDate,
  formatShortTokyoEndDate,
} from "./supportCalendar.ts";

type TokyoDateTime = {
  date: string;
  hour: number;
  minute: string;
};

function parseIsoTokyo(value: string): TokyoDateTime | null {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):\d{2}\+09:00$/.exec(value);
  if (!match) return null;
  return {
    date: match[1],
    hour: Number(match[2]),
    minute: match[3],
  };
}

function confirmedPeriodBounds(schedule: SupportEventSchedule): {
  start: TokyoDateTime;
  end: TokyoDateTime;
} | null {
  if (schedule.state !== "confirmed-period" || schedule.allDay) return null;
  const start = parseIsoTokyo(schedule.start);
  const end = parseIsoTokyo(schedule.end);
  if (!start || !end) return null;
  return { start, end };
}

function formatClock(parts: TokyoDateTime): string {
  return `${parts.hour}:${parts.minute}`;
}

function formatConfirmedWindow(schedule: SupportEventSchedule): string | null {
  const bounds = confirmedPeriodBounds(schedule);
  if (!bounds) return null;
  return `${formatShortTokyoDate(bounds.start.date)} ${formatClock(bounds.start)}〜${formatShortTokyoDate(bounds.end.date)} ${formatClock(bounds.end)}`;
}

function isThirdRoundPhase(phase: ContestPhase): boolean {
  return phase.name.includes("3次審査");
}

/** ContestPhase の日付だけから `9/3〜9/13` を作る。時刻は入れない。 */
export function contestPhaseDateRangeLabel(phase: ContestPhase): string | null {
  if (!phase.start || !phase.end) return null;
  return `${formatShortTokyoDate(phase.start)}〜${formatShortTokyoEndDate(phase.start, phase.end)}`;
}

export function contestPhaseHeading(phase: ContestPhase): string {
  const range = contestPhaseDateRangeLabel(phase);
  return range ? `${phase.name}（${range}）` : phase.name;
}

/**
 * 三次審査の公式3本。時刻は supportEvents から読む。
 * ギフト審査と CanCamモデル発掘オーディションは同じ窓でも行を分ける。
 */
export function contestOfficialWindowLines(
  phase: ContestPhase | null | undefined,
): string[] {
  if (!phase || !isThirdRoundPhase(phase)) return [];

  const web = formatConfirmedWindow(missCircleThirdRoundWebVote.schedule);
  const showroom = formatConfirmedWindow(
    missCircleThirdRoundShowroomReview.schedule,
  );
  const lines: string[] = [];
  if (web) lines.push(`WEB投票 ${web}`);
  if (showroom) {
    lines.push(`SHOWROOM無料ギフト審査 ${showroom}`);
    lines.push(`CanCamモデル発掘オーディション ${showroom}`);
    const end = confirmedPeriodBounds(missCircleThirdRoundShowroomReview.schedule)
      ?.end;
    if (end) {
      lines.push(`SHOWROOMは${formatShortTokyoDate(end.date)} ${formatClock(end)}終了`);
    }
  }
  return lines;
}

export function contestPhaseDisplayNote(phase: ContestPhase): string {
  return [contestPhaseHeading(phase), ...contestOfficialWindowLines(phase)].join(
    "\n",
  );
}

export function appendContestOfficialWindows(
  base: string,
  phase: ContestPhase | null | undefined,
): string {
  const lines = contestOfficialWindowLines(phase);
  return lines.length > 0 ? `${base}\n${lines.join("\n")}` : base;
}
