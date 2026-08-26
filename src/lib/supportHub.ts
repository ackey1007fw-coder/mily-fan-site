import { radioProgram } from "../../shared/radio-program.js";
import { activities, type ActivityId } from "../data/activities.ts";
import type { Contest } from "../data/contest.ts";
import type { RadioStatus, SchedulePhase } from "../data/radio.ts";
import type { StreamSlot } from "../data/streamSchedule.ts";
import type { SupportEvent } from "../data/supportEvents.ts";
import {
  onAirConfirmedFresh,
  programState,
  tokyoToday,
} from "./bannerState.ts";
import type { LiveView } from "./realtimeStore.ts";
import {
  adaptContestSchedule,
  adaptSupportEvents,
  liveSupportEvents,
  type PendingSupportItem,
} from "./supportCalendar.ts";

/** Support Hub（`/support/`）の正規route。ホーム側の導線もここを参照する。 */
export const SUPPORT_HUB_ROUTE = "/support/" as const;

export const RADIO_APPEARANCE_NOTE =
  "番組枠は、みりぃ本人の出演時間を示すものではありません。";

export type SupportAction = {
  label: string;
  url: string;
};

export type SupportTodayItem = {
  key: string;
  activityId: ActivityId;
  label: string;
  value: string;
  note?: string;
  source?: string;
  cta?: SupportAction;
};

export type SupportNowItem = {
  key: string;
  origin: "support-event" | "showroom-live" | "radio-program";
  activityId: ActivityId;
  title: string;
  note?: string;
  source?: string;
  cta?: SupportAction;
};

export function activityRouteForSupport(activityId: ActivityId): string {
  const activity = activities.find(({ id }) => id === activityId);
  if (!activity) throw new Error(`Unknown Activity: ${activityId}`);
  return activity.route;
}

export function selectSupportToday(input: {
  contest: Contest;
  streamSlots: StreamSlot[];
  streamRoomUrl: string | null;
  liveRoomUrl: string | null;
  radioPhase: SchedulePhase;
  now: number;
}): SupportTodayItem[] {
  if (!Number.isFinite(input.now)) {
    throw new Error("now must be a finite timestamp");
  }

  const items: SupportTodayItem[] = [];
  const phase = input.contest.currentPhase;

  if (phase) {
    items.push({
      key: "today:contest",
      activityId: "miss-circle",
      label: "現在の審査段階",
      value: phase.name,
      note: `${input.contest.lastVerifiedAt.replace(/-/g, ".")}確認`,
      source: phase.source,
      cta: {
        label: `${input.contest.entryNumber}を見る`,
        url: input.contest.entryUrl,
      },
    });
  }

  const today = tokyoToday(input.now);
  const slot = input.streamSlots.find(({ date }) => date === today);
  if (slot) {
    const roomUrl = input.liveRoomUrl ?? input.streamRoomUrl;
    items.push({
      key: `today:showroom:${slot.date}T${slot.time}`,
      activityId: "live-stream",
      label: "確認済みの配信枠",
      value: `${slot.date.replace(/-/g, ".")} ${slot.time}〜`,
      note: [slot.note, "終了時刻は確認できていません。"]
        .filter(Boolean)
        .join(" / "),
      ...(roomUrl
        ? { cta: { label: "SHOWROOMで見る", url: roomUrl } }
        : {}),
    });
  }

  if (input.radioPhase === "upcoming" || input.radioPhase === "window") {
    items.push({
      key: "today:radio-program",
      activityId: "radio",
      label:
        input.radioPhase === "window"
          ? "本日の番組放送時間"
          : "本日の番組枠",
      value: `${radioProgram.programName} ${radioProgram.scheduledStart}〜${radioProgram.scheduledEnd}`,
      note: RADIO_APPEARANCE_NOTE,
      source: radioProgram.programUrl,
      cta: { label: "ラジオを聴く", url: radioProgram.listenUrl },
    });
  }

  return items;
}

export function selectSupportNow(input: {
  supportEvents: SupportEvent[];
  live: LiveView;
  radio: RadioStatus | null;
  now: number;
}): SupportNowItem[] {
  if (!Number.isFinite(input.now)) {
    throw new Error("now must be a finite timestamp");
  }

  const items: SupportNowItem[] = liveSupportEvents(
    input.supportEvents,
    input.now,
  ).map((event) => {
    const adapted = adaptSupportEvents([event], input.now).items[0];
    return {
      key: `now:support-event:${event.id}`,
      origin: "support-event" as const,
      activityId: event.activityId,
      title: event.title,
      ...(event.note ? { note: event.note } : {}),
      source: event.source,
      ...(adapted?.cta ? { cta: adapted.cta } : {}),
    };
  });

  if (input.live.state === "live") {
    items.push({
      key: "now:showroom-live",
      origin: "showroom-live",
      activityId: "live-stream",
      title: "SHOWROOMで配信中",
      ...(input.live.roomUrl
        ? { cta: { label: "いますぐ見る", url: input.live.roomUrl } }
        : {}),
    });
  }

  if (
    programState(input.radio, input.now) === "PROGRAM_WINDOW" &&
    onAirConfirmedFresh(input.radio, input.now)
  ) {
    items.push({
      key: "now:radio-program",
      origin: "radio-program",
      activityId: "radio",
      title: `${input.radio?.programName ?? radioProgram.programName} 番組放送中`,
      note: RADIO_APPEARANCE_NOTE,
      source: input.radio?.sourceUrl ?? radioProgram.nowOnAirSourceUrl,
      cta: {
        label: "ラジオを聴く",
        url: input.radio?.listenUrl ?? radioProgram.listenUrl,
      },
    });
  }

  return items;
}

export function selectSupportPending(input: {
  contest: Contest;
  supportEvents: SupportEvent[];
}): PendingSupportItem[] {
  return [
    ...adaptContestSchedule(input.contest).pending,
    ...adaptSupportEvents(input.supportEvents).pending,
  ];
}
