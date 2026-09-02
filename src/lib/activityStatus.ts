import { radioProgram } from "../../shared/radio-program.js";
import type { RadioStatus, SchedulePhase } from "../data/radio.ts";
import type { StreamSlot } from "../data/streamSchedule.ts";
import { onAirConfirmedFresh } from "./bannerState.ts";
import type { LiveView } from "./realtimeStore.ts";

export type RadioActivityStatus = {
  label: string;
  value: string;
  note: string;
  href: string;
};

export type LiveActivityStatus =
  | {
      state: "live" | "offline";
      label: string;
      value: string;
      href: string | null;
      slot: null;
    }
  | {
      state: "scheduled";
      label: string;
      value: string;
      href: string | null;
      slot: StreamSlot;
    };

function weekdayLabel(weekday: number): string {
  const sunday = Date.UTC(2024, 0, 7);
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "UTC",
    weekday: "long",
  }).format(new Date(sunday + weekday * 24 * 60 * 60 * 1000));
}

export function selectRadioActivityStatus(
  radio: RadioStatus | null,
  phase: SchedulePhase,
  now: number = Date.now(),
): RadioActivityStatus {
  const programName = radio?.programName ?? radioProgram.programName;
  const start = radio?.scheduledStart ?? radioProgram.scheduledStart;
  const end = radio?.scheduledEnd ?? radioProgram.scheduledEnd;

  let label = "確認済みの番組枠";
  let value = `${weekdayLabel(radioProgram.weekday)} ${start}〜${end}`;
  if (phase === "window") {
    label = "番組のリアルタイム状態";
    value = onAirConfirmedFresh(radio, now)
      ? `${programName} 番組放送中`
      : `${programName} 放送時間`;
  } else if (phase === "upcoming") {
    label = "本日の番組枠";
    value = `${programName} ${start}〜${end} 予定`;
  }

  return {
    label,
    value,
    note: "番組枠は、みりぃ本人の出演時間を示すものではありません。",
    href: radioProgram.nowOnAirSourceUrl,
  };
}

export function selectLiveActivityStatus(
  live: LiveView,
  slots: StreamSlot[],
  scheduleRoomUrl: string | null,
  now: number = Date.now(),
): LiveActivityStatus | null {
  if (live.state === "live") {
    return {
      state: "live",
      label: "リアルタイム",
      value: "SHOWROOMで配信中",
      href: live.roomUrl ?? scheduleRoomUrl,
      slot: null,
    };
  }

  const slot = slots[0];
  if (slot) {
    const start = new Date(`${slot.date}T${slot.time}:00+09:00`).getTime();
    return {
      state: "scheduled",
      label: start > now ? "次回の確認済み配信枠" : "確認済み配信枠",
      value: `${slot.date} ${slot.time}〜${slot.endTime ?? ""}`,
      href: live.roomUrl ?? scheduleRoomUrl,
      slot,
    };
  }

  if (live.state === "offline") {
    return {
      state: "offline",
      label: "リアルタイム",
      value: "現在、配信中ではないことを確認しました",
      href: live.roomUrl ?? scheduleRoomUrl,
      slot: null,
    };
  }

  return null;
}
