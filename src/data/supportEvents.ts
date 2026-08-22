import { isValidDateOnly, isValidDateTime } from "./events.ts";
import { activities, type ActivityId } from "./activities.ts";
import { links } from "./links.ts";

export type SupportEventKind =
  | "vote"
  | "deadline"
  | "stream-event"
  | "support-campaign"
  | "result";

export type SupportEventSchedule =
  | {
      state: "confirmed-period";
      start: string;
      end: string;
      allDay: boolean;
      timezone: "Asia/Tokyo";
    }
  | {
      state: "confirmed-instant";
      at: string;
      allDay: boolean;
      timezone: "Asia/Tokyo";
    }
  | {
      state: "date-pending";
    };

export type SupportEvent = {
  id: string;
  activityId: ActivityId;
  kind: SupportEventKind;
  title: string;
  note?: string;
  schedule: SupportEventSchedule;
  ctaLinkId?: string;
  source: string;
  verifiedAt: string;
  priority?: number;
};

const supportEventKinds = new Set<SupportEventKind>([
  "vote",
  "deadline",
  "stream-event",
  "support-campaign",
  "result",
]);

const activityIds = new Set<ActivityId>(activities.map(({ id }) => id));
const linkIds = new Set(links.map(({ id }) => id));

function hasOnlyKeys(candidate: Record<string, unknown>, allowed: string[]): boolean {
  const allowedKeys = new Set(allowed);
  return Object.keys(candidate).every((key) => allowedKeys.has(key));
}

function validScheduledValue(value: unknown, allDay: boolean): value is string {
  if (typeof value !== "string") return false;
  return allDay ? isValidDateOnly(value) : isValidDateTime(value);
}

function scheduledValueMs(value: string, allDay: boolean): number {
  return Date.parse(allDay ? `${value}T00:00:00+09:00` : value);
}

export function isValidSupportEventSchedule(
  schedule: unknown,
): schedule is SupportEventSchedule {
  if (typeof schedule !== "object" || schedule === null) return false;
  const candidate = schedule as Record<string, unknown>;

  if (candidate.state === "date-pending") {
    return hasOnlyKeys(candidate, ["state"]);
  }

  if (
    typeof candidate.allDay !== "boolean" ||
    candidate.timezone !== "Asia/Tokyo"
  ) {
    return false;
  }

  if (candidate.state === "confirmed-period") {
    if (!hasOnlyKeys(candidate, ["state", "start", "end", "allDay", "timezone"])) {
      return false;
    }
    if (
      !validScheduledValue(candidate.start, candidate.allDay) ||
      !validScheduledValue(candidate.end, candidate.allDay)
    ) {
      return false;
    }
    return (
      scheduledValueMs(candidate.end, candidate.allDay) >=
      scheduledValueMs(candidate.start, candidate.allDay)
    );
  }

  if (candidate.state === "confirmed-instant") {
    return (
      hasOnlyKeys(candidate, ["state", "at", "allDay", "timezone"]) &&
      validScheduledValue(candidate.at, candidate.allDay)
    );
  }

  return false;
}

export function isValidSupportEvent(event: unknown): event is SupportEvent {
  if (typeof event !== "object" || event === null) return false;
  const candidate = event as Record<string, unknown>;
  if (
    !hasOnlyKeys(candidate, [
      "id",
      "activityId",
      "kind",
      "title",
      "note",
      "schedule",
      "ctaLinkId",
      "source",
      "verifiedAt",
      "priority",
    ])
  ) {
    return false;
  }

  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.activityId === "string" &&
    activityIds.has(candidate.activityId as ActivityId) &&
    typeof candidate.kind === "string" &&
    supportEventKinds.has(candidate.kind as SupportEventKind) &&
    typeof candidate.title === "string" &&
    candidate.title.length > 0 &&
    (candidate.note === undefined || typeof candidate.note === "string") &&
    isValidSupportEventSchedule(candidate.schedule) &&
    (candidate.ctaLinkId === undefined ||
      (typeof candidate.ctaLinkId === "string" && linkIds.has(candidate.ctaLinkId))) &&
    typeof candidate.source === "string" &&
    /^https?:\/\//.test(candidate.source) &&
    typeof candidate.verifiedAt === "string" &&
    isValidDateOnly(candidate.verifiedAt) &&
    (candidate.priority === undefined || Number.isFinite(candidate.priority))
  );
}

/**
 * No independent support period is confirmed in current main.
 * Contest phases, public appearances, SHOWROOM slots, and radio slots remain in
 * their existing domain sources and are adapted by supportCalendar.ts.
 */
export const supportEvents: SupportEvent[] = [];
