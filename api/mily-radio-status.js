// api/mily-radio-status.js
// FM湘南マジックウェイブ「湘南シーサイドサークル」の放送状態。
//
// 返すもの:
//   - 今日が放送日か / 何時からか / いま時間帯か（Asia/Tokyo、確認済みの日曜 10:00-13:00）
//   - トップページ NOW ON AIR の番組名が明確に一致したときだけ onAirConfirmed: true
//   - 聴取ページ URL
//
// 時間帯や NOW ON AIR だけでは「Mily本人出演中」とは判定しない。
// milyAppearanceConfirmed は常に null。
// 外部ページの取得失敗・HTML変更・曖昧な解析では onAirConfirmed: null
// （false=別番組/NOT ON AIR を読めた、null=unavailable を区別する）。
// どの段階で失敗しても 200 と安全な JSON を返し、サイトは壊さない。

const PROGRAM_NAME = "湘南シーサイドサークル";
const SCHEDULED_WEEKDAY = 0;
const SCHEDULED_START = "10:00";
const SCHEDULED_END = "13:00";
const LISTEN_URL = "https://fm-smw.jp/radio";
const NOW_ON_AIR_SOURCE_URL = "https://fm-smw.jp/";
const TIMEZONE = "Asia/Tokyo";
const FETCH_TIMEOUT_MS = 8000;

const USER_AGENT =
  "Mozilla/5.0 (compatible; MilyFanSite/1.0; +https://mily-fan-site.vercel.app)";

const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const tokyoClockFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TIMEZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function partValue(parts, type) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export function tokyoClock(now = Date.now()) {
  const parts = tokyoClockFmt.formatToParts(new Date(now));
  const weekday = WEEKDAY_INDEX[partValue(parts, "weekday")];
  const hour = Number(partValue(parts, "hour"));
  const minute = Number(partValue(parts, "minute"));
  if (
    weekday === undefined ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute)
  ) {
    throw new Error("failed to read Asia/Tokyo clock");
  }
  return { weekday, hour, minute };
}

function parseHm(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) throw new Error(`invalid HH:mm: ${value}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

export function isBroadcastDay(now = Date.now()) {
  return tokyoClock(now).weekday === SCHEDULED_WEEKDAY;
}

export function isInScheduledWindow(now = Date.now()) {
  const clock = tokyoClock(now);
  if (clock.weekday !== SCHEDULED_WEEKDAY) return false;
  const current = clock.hour * 60 + clock.minute;
  return current >= parseHm(SCHEDULED_START) && current < parseHm(SCHEDULED_END);
}

export function programNameMatches(raw) {
  if (typeof raw !== "string") return false;
  const compact = raw
    .normalize("NFKC")
    .replace(/[『』「」【】\[\]]/g, "")
    .replace(/[#＃]\s*SSC\b/gi, "")
    .replace(/\s+/g, "");
  return compact === PROGRAM_NAME;
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    );
}

/** タグと img を除いた可視テキスト。alt の "NOW ON AIR" を拾わない。 */
export function visibleText(html) {
  if (typeof html !== "string") return "";
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<img\b[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

/**
 * NOW ON AIR 欄だけを切り出す。
 * NEXT ON AIR / RECOMMEND に番組名があっても採用しない。
 */
export function extractNowOnAirBlock(html) {
  if (typeof html !== "string" || html.length === 0) return null;
  const left = html.match(
    /<div class="left-wrap">([\s\S]*?)<div class="right-wrap">/,
  );
  if (left?.[1]) return left[1];
  const box = html.match(
    /<div class="radio-number01">([\s\S]*?)<\/div>\s*<\/div>/,
  );
  return box?.[1] ?? null;
}

/**
 * @returns {{ status: "now-on-air" | "not-on-air" | "unavailable", title: string | null }}
 */
export function parseNowOnAir(html) {
  const block = extractNowOnAirBlock(html);
  if (!block) return { status: "unavailable", title: null };

  const titleMatch = block.match(/<p class="title01">([\s\S]*?)<\/p>/);
  if (!titleMatch) return { status: "unavailable", title: null };

  const heading = visibleText(titleMatch[1]);
  if (heading === "NOT ON AIR") return { status: "not-on-air", title: null };
  if (heading !== "NOW ON AIR") return { status: "unavailable", title: null };

  const after = block.slice(block.indexOf(titleMatch[0]) + titleMatch[0].length);
  const h4 = after.match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
  const link = after.match(/<a[^>]*>([\s\S]*?)<\/a>/);
  const title = visibleText(h4?.[1] ?? link?.[1] ?? "");
  if (!title || /現在放送中の番組はありません/.test(title)) {
    return { status: "not-on-air", title: null };
  }
  return { status: "now-on-air", title };
}

/**
 * true / false / null を区別する。
 * 番組名の明確一致だけ true。別番組・NOT ON AIR は false。それ以外は null。
 */
export function resolveOnAirConfirmed(parsed) {
  if (!parsed || parsed.status === "unavailable") return null;
  if (parsed.status === "not-on-air") return false;
  if (parsed.status !== "now-on-air") return null;
  if (typeof parsed.title !== "string" || parsed.title.length === 0) return null;
  return programNameMatches(parsed.title) ? true : false;
}

export function buildRadioStatus({
  now = Date.now(),
  onAirConfirmed = null,
} = {}) {
  const clockOk = (() => {
    try {
      tokyoClock(now);
      return true;
    } catch {
      return false;
    }
  })();

  return {
    ok: clockOk,
    programName: PROGRAM_NAME,
    todayScheduled: clockOk ? isBroadcastDay(now) : false,
    scheduledStart: SCHEDULED_START,
    scheduledEnd: SCHEDULED_END,
    inScheduledWindow: clockOk ? isInScheduledWindow(now) : false,
    onAirConfirmed: onAirConfirmed === true || onAirConfirmed === false
      ? onAirConfirmed
      : null,
    milyAppearanceConfirmed: null,
    listenUrl: LISTEN_URL,
    sourceUrl: NOW_ON_AIR_SOURCE_URL,
    updatedAt: new Date(now).toISOString(),
  };
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, ...init.headers },
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRadioStatus({
  now = Date.now(),
  fetchPage = fetchWithTimeout,
} = {}) {
  let onAirConfirmed = null;
  try {
    const page = await fetchPage(NOW_ON_AIR_SOURCE_URL, {
      headers: { Accept: "text/html" },
    });
    if (page && page.ok) {
      const html = await page.text();
      onAirConfirmed = resolveOnAirConfirmed(parseNowOnAir(html));
    }
  } catch {
    onAirConfirmed = null;
  }

  return buildRadioStatus({ now, onAirConfirmed });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60,stale-while-revalidate=300");
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    return res.status(200).json(await fetchRadioStatus());
  } catch {
    return res.status(200).json(buildRadioStatus({ onAirConfirmed: null }));
  }
}
