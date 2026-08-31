import { canonicalUrl, site } from "../data/site.ts";
import { contest } from "../data/contest.ts";
import {
  radioProgram,
  schedulePhase,
  type SchedulePhase,
} from "../data/radio.ts";
import { supportEvents, type SupportEvent } from "../data/supportEvents.ts";
import {
  displayStatus,
  formatScheduleEndLabel,
  formatShortTokyoDate,
} from "./supportCalendar.ts";

export type SiteSharePayload = {
  title: string;
  text: string;
  url: string;
};

export type WebShareResult = "shared" | "cancelled" | "unsupported";

export type SiteShareContext = {
  now?: number;
  radioPhase?: SchedulePhase;
};

type WebShareApi = {
  share?: (data: SiteSharePayload) => Promise<void>;
  canShare?: (data: SiteSharePayload) => boolean;
};

type ClipboardWriter = {
  writeText: (text: string) => Promise<void>;
};

type ShareTopic = {
  id: string;
  priority: number;
  text: string;
  hashtags: string[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const UPCOMING_CONTEST_DAYS = 7;
const MAX_SHARE_TOPICS = 3;

function safeRadioPhase(now: number): SchedulePhase {
  try {
    return schedulePhase(now);
  } catch {
    return "idle";
  }
}

function radioShareTopic(phase: SchedulePhase): ShareTopic | null {
  if (phase === "upcoming") {
    return {
      id: "radio-upcoming",
      priority: 400,
      text: `今日${radioProgram.scheduledStart}〜は「${radioProgram.programName}」📻`,
      hashtags: ["湘南シーサイドサークル", "ssc"],
    };
  }
  if (phase === "window") {
    return {
      id: "radio-window",
      priority: 400,
      text: `ただいま「${radioProgram.programName}」の放送時間です📻`,
      hashtags: ["湘南シーサイドサークル", "ssc"],
    };
  }
  return null;
}

function compactEndLabel(event: SupportEvent): string | null {
  return formatScheduleEndLabel(event.schedule)?.replace("（JST）", "") ?? null;
}

function supportEventShareTopics(now: number): ShareTopic[] {
  return supportEvents
    .filter(
      (event) =>
        event.shareText !== undefined &&
        displayStatus(event.schedule, now) === "live",
    )
    .map((event) => {
      const end = compactEndLabel(event);
      return {
        id: event.id,
        priority: 200 + (event.priority ?? 0),
        text: `${event.shareText}${end ? `（${end}まで）` : ""}`,
        hashtags: event.shareHashtags ?? [],
      };
    });
}

function contestPhaseShareTopic(now: number): ShareTopic | null {
  const phase = contest.currentPhase;
  if (!phase?.start || !phase.end) return null;

  const start = Date.parse(`${phase.start}T00:00:00+09:00`);
  const endExclusive = Date.parse(`${phase.end}T00:00:00+09:00`) + DAY_MS;
  if (!Number.isFinite(start) || !Number.isFinite(endExclusive)) return null;

  const phaseLabel = phase.name.replace(/進出$/, "");
  if (now >= start && now < endExclusive) {
    return {
      id: "contest-active",
      priority: 180,
      text: `${contest.contestName}の${phaseLabel}を応援してください🔥（${formatShortTokyoDate(phase.end)}まで）`,
      hashtags: phase.shareHashtags ?? [],
    };
  }

  if (now < start && start - now <= UPCOMING_CONTEST_DAYS * DAY_MS) {
    return {
      id: "contest-upcoming",
      priority: 160,
      text: `${formatShortTokyoDate(phase.start)}から${contest.contestName}の${phaseLabel}が始まります🔥`,
      hashtags: phase.shareHashtags ?? [],
    };
  }

  return null;
}

export function siteShareText(context: SiteShareContext = {}): string {
  const now = context.now ?? Date.now();
  if (!Number.isFinite(now)) throw new Error("now must be a finite timestamp");

  const topics = [
    radioShareTopic(context.radioPhase ?? safeRadioPhase(now)),
    ...supportEventShareTopics(now),
    contestPhaseShareTopic(now),
  ]
    .filter((topic): topic is ShareTopic => topic !== null)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, MAX_SHARE_TOPICS);

  if (topics.length === 0) return site.description;

  const hashtags = topics[0]?.hashtags.map((tag) => `#${tag}`).join(" ");

  return [
    "みりぃ（三橋莉子 / Mily）さんを応援しています🍅✨",
    ...topics.map(({ text }) => text),
    "最新の活動・応援情報はこちら👇",
    ...(hashtags ? [hashtags] : []),
  ].join("\n");
}

/**
 * Public share payload for the fan site itself.
 * URL is canonical; text is selected from verified, date-aware site data.
 */
export function siteSharePayload(context: SiteShareContext = {}): SiteSharePayload {
  return {
    title: site.displayTitle,
    text: siteShareText(context),
    url: canonicalUrl(),
  };
}

export function xShareUrl(payload: SiteSharePayload = siteSharePayload()): string {
  const text = encodeURIComponent(payload.text);
  const url = encodeURIComponent(payload.url);
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

export function lineShareUrl(
  payload: SiteSharePayload = siteSharePayload(),
): string {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(payload.url)}`;
}

export function facebookShareUrl(
  payload: SiteSharePayload = siteSharePayload(),
): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(payload.url)}`;
}

export function threadsShareUrl(
  payload: SiteSharePayload = siteSharePayload(),
): string {
  const text = encodeURIComponent(payload.text);
  const url = encodeURIComponent(payload.url);
  return `https://www.threads.com/intent/post?text=${text}&url=${url}`;
}

export function canUseWebShare(
  payload: SiteSharePayload = siteSharePayload(),
  shareApi: WebShareApi | undefined = globalThis.navigator,
): boolean {
  if (!shareApi || typeof shareApi.share !== "function") {
    return false;
  }

  if (typeof shareApi.canShare !== "function") {
    return true;
  }

  try {
    return shareApi.canShare(payload) === true;
  } catch {
    return true;
  }
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

/**
 * Opens the OS share sheet. Call only from a user gesture.
 * Does not run at module load or on mount.
 */
export async function shareWithWebShare(
  payload: SiteSharePayload = siteSharePayload(),
  shareApi: WebShareApi | undefined = globalThis.navigator,
): Promise<WebShareResult> {
  if (!shareApi || typeof shareApi.share !== "function") {
    return "unsupported";
  }

  try {
    await shareApi.share(payload);
    return "shared";
  } catch (error) {
    if (isAbortError(error)) {
      return "cancelled";
    }
    return "unsupported";
  }
}

export function copyWithExecCommand(text: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const previous =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute("aria-hidden", "true");
  textarea.tabIndex = -1;
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
    if (previous && previous.isConnected) {
      previous.focus({ preventScroll: true });
    }
  }
}

export async function copyUrlToClipboard(
  url: string,
  clipboard: ClipboardWriter | undefined = globalThis.navigator?.clipboard,
  fallback: (text: string) => boolean = copyWithExecCommand,
): Promise<boolean> {
  try {
    if (clipboard && typeof clipboard.writeText === "function") {
      await clipboard.writeText(url);
      return true;
    }
  } catch {
    // Clipboard API can be missing or blocked; try the fallback.
  }

  try {
    return fallback(url) === true;
  } catch {
    return false;
  }
}
