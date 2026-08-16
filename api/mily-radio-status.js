// api/mily-radio-status.js
// FM湘南マジックウェイブ「湘南シーサイドサークル」の放送状態。
//
// 返すもの:
//   - 今日が放送日か / 何時からか / いま時間帯か（Asia/Tokyo、確認済みの日曜 10:00-13:00）
//   - トップページ NOW ON AIR の番組名が明確に一致したときだけ onAirConfirmed: true
//   - 聴取ページ URL
//
// 時間帯や NOW ON AIR だけでは本人の出演有無を確定しない。
// milyAppearanceConfirmed は常に null。
// 外部ページの取得失敗・HTML変更・曖昧な解析では onAirConfirmed: null
// （false=別番組/NOT ON AIR を読めた、null=unavailable を区別する）。
// どの段階で失敗しても 200 と安全な JSON を返し、サイトは壊さない。

import {
  isBroadcastDay,
  isInScheduledWindow,
  nextStartAtIso,
  programNameMatches,
  radioProgram,
  schedulePhase,
  tokyoClock,
} from "../shared/radio-program.js";

// 番組名・曜日・時刻・URL は shared/radio-program.js が単一 source of truth。
// ここでは再定義しない。
export {
  isBroadcastDay,
  isInScheduledWindow,
  programNameMatches,
  schedulePhase,
  tokyoClock,
};

const FETCH_TIMEOUT_MS = 8000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; MilyFanSite/1.0; +https://mily-fan-site.vercel.app)";

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
  // 「番組はありません」と明示されたときだけ not-on-air。
  // タイトルが空 / 解析不能 / HTML 構造変更は unavailable（false と確定しない）。
  if (/現在放送中の番組はありません/.test(title)) {
    return { status: "not-on-air", title: null };
  }
  if (!title) return { status: "unavailable", title: null };
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
    programName: radioProgram.programName,
    todayScheduled: clockOk ? isBroadcastDay(now) : false,
    scheduledStart: radioProgram.scheduledStart,
    scheduledEnd: radioProgram.scheduledEnd,
    inScheduledWindow: clockOk ? isInScheduledWindow(now) : false,
    schedulePhase: clockOk ? schedulePhase(now) : "idle",
    nextStartAt: clockOk ? nextStartAtIso(now) : null,
    onAirConfirmed:
      onAirConfirmed === true || onAirConfirmed === false ? onAirConfirmed : null,
    milyAppearanceConfirmed: null,
    listenUrl: radioProgram.listenUrl,
    sourceUrl: radioProgram.nowOnAirSourceUrl,
    lastVerifiedAt: radioProgram.lastVerifiedAt,
    updatedAt: new Date(now).toISOString(),
  };
}

/**
 * body の読み取り完了まで timeout を効かせる。
 * headers 受信時点で timer を解除すると、本文が届かないまま無限に待てる。
 */
export async function fetchTextWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, ...init.headers },
    });
    if (!res.ok) return null;
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRadioStatus({
  now = Date.now(),
  fetchPage = fetchTextWithTimeout,
} = {}) {
  let onAirConfirmed = null;
  try {
    const html = await fetchPage(radioProgram.nowOnAirSourceUrl, {
      headers: { Accept: "text/html" },
    });
    if (typeof html === "string" && html.length > 0) {
      onAirConfirmed = resolveOnAirConfirmed(parseNowOnAir(html));
    }
  } catch {
    onAirConfirmed = null;
  }

  return buildRadioStatus({ now, onAirConfirmed });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // リアルタイムバナーから使うので短め
  res.setHeader("Cache-Control", "s-maxage=12,stale-while-revalidate=12");
  res.setHeader("Allow", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "method not allowed" });
  }
  try {
    return res.status(200).json(await fetchRadioStatus());
  } catch {
    return res.status(200).json(buildRadioStatus({ onAirConfirmed: null }));
  }
}
