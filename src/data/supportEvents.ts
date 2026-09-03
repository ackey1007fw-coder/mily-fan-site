import { isValidDateOnly, isValidDateTime } from "./events.ts";
import { activities, type ActivityId } from "./activities.ts";
import {
  links,
  missCircleShowroomEventLink,
  missCircleWebVoteLink,
} from "./links.ts";

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
  /** 期間中のサイト共有文へ載せる、確認済みの短い呼びかけ。 */
  shareText?: string;
  /** 共有文で、この企画が最優先の間だけ人物タグと並べるハッシュタグ。 */
  shareHashtag?: string;
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
      "shareText",
      "shareHashtag",
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
    (candidate.shareText === undefined ||
      (typeof candidate.shareText === "string" && candidate.shareText.length > 0)) &&
    (candidate.shareHashtag === undefined ||
      (typeof candidate.shareHashtag === "string" &&
        /^#[^\s#]+$/u.test(candidate.shareHashtag))) &&
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

export const missCircleThirdRoundWebVote: SupportEvent = {
  id: "miss-circle-2026-3rd-web-vote",
  activityId: "miss-circle",
  kind: "vote",
  title: "WEB投票",
  shareText:
    "MISS CIRCLE CONTEST 2026 3次審査のWEB投票をお願いします🗳️",
  shareHashtag: "#ミスサークル2026",
  schedule: {
    state: "confirmed-period",
    start: "2026-09-03T12:00:00+09:00",
    end: "2026-09-13T23:59:00+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  },
  ctaLinkId: missCircleWebVoteLink.id,
  source: "https://www.misscircle.jp/",
  verifiedAt: "2026-09-02",
  priority: 90,
};

export const missCircleThirdRoundShowroomReview: SupportEvent = {
  id: "miss-circle-2026-3rd-showroom-review",
  activityId: "miss-circle",
  kind: "stream-event",
  title: "SHOWROOM無料ギフト審査・イベント審査",
  schedule: {
    state: "confirmed-period",
    start: "2026-09-03T05:00:00+09:00",
    end: "2026-09-12T21:59:00+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  },
  ctaLinkId: missCircleShowroomEventLink.id,
  source: "https://www.showroom-live.com/event/circle2026_3rd",
  verifiedAt: "2026-09-02",
  priority: 80,
};

export const campusGirlsFinalStagePatonVote: SupportEvent = {
  id: "campus-girls-final-stage-paton-2026",
  activityId: "campus-girls",
  kind: "vote",
  title: "CAMPUS GIRLS 2027 予選A FinalSTAGE Paton投票",
  note:
    "Patonの三橋莉子（みりぃ）ページから応援できます。投票にはPatonへのログインが必要です。",
  shareText: "CAMPUS GIRLS 2027のPaton投票をお願いします🗳️",
  shareHashtag: "#キャンガル2027",
  schedule: {
    state: "confirmed-period",
    start: "2026-08-26T18:00:00+09:00",
    end: "2026-09-01T23:59:00+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  },
  ctaLinkId: "campus-girls-paton-11380",
  source: "https://paton.jp/event/detail/499",
  verifiedAt: "2026-08-26",
  priority: 100,
};

export const supportEvents: SupportEvent[] = [
  campusGirlsFinalStagePatonVote,
  missCircleThirdRoundWebVote,
  missCircleThirdRoundShowroomReview,
];
