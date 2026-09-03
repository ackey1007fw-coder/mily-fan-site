import type { Contest } from "../data/contest.ts";
import type { SiteLink } from "../data/links.ts";
import {
  campusGirlsFinalStagePatonVote,
  type SupportEvent,
} from "../data/supportEvents.ts";
import { ACTIVITIES_HUB_ROUTE } from "./activityRoute.ts";
import { contestPhaseDisplayNote } from "./contestPhaseDisplay.ts";
import { tokyoDateKey } from "./monthCalendar.ts";
import { SUPPORT_HUB_ROUTE } from "./supportHub.ts";
import { patonVoteLiveNote } from "./patonVoteLiveCopy.ts";
import { displayStatus, formatScheduleEndLabel } from "./supportCalendar.ts";

export const HOME_ROUTE = "/" as const;
export const NEWS_ARCHIVE_ROUTE = "/news/" as const;
export const STORIES_ARCHIVE_ROUTE = "/stories/" as const;
export const GALLERY_ARCHIVE_ROUTE = "/gallery/" as const;
export const PROFILE_ROUTE = "/profile/" as const;

export const HOME_NEWS_LIMIT = 3;
export const HOME_STORY_LIMIT = 3;
export const HOME_GALLERY_LIMIT = 6;

export const NEWS_ARCHIVE_INITIAL = 10;
export const GALLERY_ARCHIVE_INITIAL = 12;
export const ARCHIVE_PAGE_SIZE = 10;

export const HOME_NEWS_ARCHIVE_CTA = "最新情報をすべて見る";
export const HOME_STORY_ARCHIVE_CTA = "STORYをもっと見る";
export const HOME_GALLERY_ARCHIVE_CTA = "ギャラリーをすべて見る";
export const ARCHIVE_LOAD_MORE_LABEL = "もっと見る";

export const SUPPORT_GATEWAY_CTA = "応援・予定を見る";
export const ACTIVITIES_GATEWAY_CTA = "Activities Hubを見る";

export const HOME_FOLLOW_HEADING = "みりぃをフォロー";
export const HOME_FOLLOW_LEAD = "SNS・配信をフォローして最新情報をチェック";
export const HOME_RADIO_CTA = "ラジオを聴く";
export const HOME_RADIO_LEAD = "湘南シーサイドサークル";

export type HomeVoteAction = {
  kind: "support-event" | "contest";
  label: string;
  url: string;
  title: string;
  note?: string;
  /** 期間限定投票の確認済み終了。終了後の導線には付けない。 */
  deadlineLabel?: string;
};

export type HomeVoteSpotlight = {
  state: "upcoming" | "live";
  eyebrow: string;
  title: string;
  note: string;
  action: {
    label: string;
    mobileLabel: string;
    url: string;
  };
};

const tokyoClockFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function contestPhaseLabel(contest: Contest): string {
  return contest.currentPhase?.name.replace(/進出$/, "") ?? contest.contestName;
}

/**
 * MISS CIRCLEの確認済みWEB投票を、開始日と期間中だけトップで強調する。
 * 開始前は投票URLを出さずENTRYページへ案内し、開始時刻に直接投票へ切り替える。
 */
export function selectHomeVoteSpotlight(input: {
  contest: Contest;
  supportEvents: SupportEvent[];
  links: SiteLink[];
  now: number;
}): HomeVoteSpotlight | null {
  if (!Number.isFinite(input.now)) {
    throw new Error("now must be a finite timestamp");
  }

  const candidates = input.supportEvents
    .filter(
      (event) =>
        event.activityId === "miss-circle" &&
        event.kind === "vote" &&
        event.ctaLinkId !== undefined &&
        event.schedule.state === "confirmed-period" &&
        !event.schedule.allDay,
    )
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  for (const event of candidates) {
    if (event.schedule.state !== "confirmed-period" || event.schedule.allDay) {
      continue;
    }
    const link = input.links.find(({ id }) => id === event.ctaLinkId);
    if (!link) continue;

    const status = displayStatus(event.schedule, input.now);
    const phase = contestPhaseLabel(input.contest);
    if (status === "upcoming") {
      const start = Date.parse(event.schedule.start);
      if (tokyoDateKey(start) !== tokyoDateKey(input.now)) continue;
      const startClock = tokyoClockFormatter.format(new Date(start));
      return {
        state: "upcoming",
        eyebrow: `${phase}・本日スタート`,
        title: `本日${startClock}からWEB投票`,
        note: `${startClock}になると、この案内は${input.contest.entryNumber}への投票ボタンに切り替わります。`,
        action: {
          label: `開始前に${input.contest.entryNumber}を見る`,
          mobileLabel: `${startClock} 投票開始`,
          url: input.contest.entryUrl,
        },
      };
    }

    if (status === "live") {
      const deadline = formatScheduleEndLabel(event.schedule);
      return {
        state: "live",
        eyebrow: `${phase}・WEB投票`,
        title: "WEB投票受付中",
        note: `${input.contest.entryNumber} 三橋莉子の投票ページへ直接進めます。${deadline ? `\n投票締切 ${deadline}` : ""}`,
        action: {
          label: `${input.contest.entryNumber}に投票する`,
          mobileLabel: "WEB投票する",
          url: link.url,
        },
      };
    }
  }

  return null;
}

function contestVoteAction(contest: Contest): HomeVoteAction {
  return {
    kind: "contest",
    label: `${contest.entryNumber}を応援する`,
    url: contest.entryUrl,
    title: contest.contestName,
    ...(contest.currentPhase
      ? { note: contestPhaseDisplayNote(contest.currentPhase) }
      : {}),
  };
}

/**
 * 期間中の確認済み投票をホームの最優先CTAにする。
 * 終了後は古い投票を案内せず、常設のMISS CIRCLE ENTRY導線へ戻す。
 */
export function selectHomeVoteAction(input: {
  contest: Contest;
  supportEvents: SupportEvent[];
  links: SiteLink[];
  now: number;
}): HomeVoteAction {
  if (!Number.isFinite(input.now)) {
    throw new Error("now must be a finite timestamp");
  }

  const activeVotes = input.supportEvents
    .filter(
      (event) =>
        event.kind === "vote" &&
        event.ctaLinkId !== undefined &&
        displayStatus(event.schedule, input.now) === "live",
    )
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  for (const event of activeVotes) {
    const link = input.links.find(({ id }) => id === event.ctaLinkId);
    if (!link) continue;

    const deadline = formatScheduleEndLabel(event.schedule);
    const note =
      event.id === campusGirlsFinalStagePatonVote.id
        ? patonVoteLiveNote(event.note, input.now)
        : event.note;
    return {
      kind: "support-event",
      label: link.label,
      url: link.url,
      title: event.title,
      ...(note ? { note } : {}),
      ...(deadline ? { deadlineLabel: `投票締切 ${deadline}` } : {}),
    };
  }

  return contestVoteAction(input.contest);
}

/**
 * 期間限定の投票がある間も、常設のMISS CIRCLE ENTRY導線を消さない。
 * 同じURLは重ねず、期間限定投票を先頭にして両方の応援先を返す。
 */
export function selectHomeVoteActions(
  input: Parameters<typeof selectHomeVoteAction>[0],
): [HomeVoteAction, ...HomeVoteAction[]] {
  const primary = selectHomeVoteAction(input);
  const contestAction = contestVoteAction(input.contest);

  return primary.url === contestAction.url
    ? [primary]
    : [primary, contestAction];
}

export {
  ACTIVITIES_HUB_ROUTE,
  SUPPORT_HUB_ROUTE,
};
