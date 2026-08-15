/**
 * ENTRY 734 の公開情報を定期チェックし、サイト登録値との差分を報告する。
 *
 *   node scripts/watch-public-sources.mjs
 *
 * **このスクリプトはリポジトリのデータを一切書き換えない。**
 * 変更を検出しても Issue / workflow summary で人間に確認を求めるだけで、
 * commit / push / merge は行わない（誤検知の可能性があるため）。
 *
 * 取得ロジックは api/mily-schedule.js の抽出・検証関数をそのまま再利用する。
 * 出力:
 *   - stdout に人間向けの Markdown レポート
 *   - WATCH_REPORT_PATH が指定されていればそこへ Markdown を書き出す
 *   - WATCH_OUTPUT_PATH（GitHub Actions の $GITHUB_OUTPUT）に
 *     has-changes / fingerprint / title を書き出す
 * 終了コードは常に 0（監視の失敗でワークフローを赤くしない）。
 */
import { writeFile, appendFile } from "node:fs/promises";
import {
  extractShowroomKeys,
  extractShowroomRoomIds,
  extractSnsLinks,
  filterMilyLinks,
  looksLikeEntryPage,
  roomNameMatchesMily,
} from "../api/mily-schedule.js";
import { contest } from "../src/data/contest.ts";
import { socials } from "../src/data/socials.ts";
import {
  SEVERITY,
  diffPhase,
  diffShowroom,
  diffSnsLinks,
  fingerprint,
  hasChanges,
  renderReport,
  sanitizeValue,
} from "./watch-lib.mjs";

const SHOWROOM_STATUS_API =
  "https://www.showroom-live.com/api/room/status?room_url_key=";
const SHOWROOM_PROFILE_API =
  "https://www.showroom-live.com/api/room/profile?room_id=";
const AGE_SCHEDULE_BASE = "https://marquez.age.co.jp/schedule/";
const FETCH_TIMEOUT_MS = 10000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; MilyFanSiteWatch/1.0; +https://mily-fan-site.vercel.app)";

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

/** ENTRY ページから本人 SHOWROOM ルームを解決する（api 側と同じ検証を通す）。 */
async function resolveRoom(html) {
  for (const key of extractShowroomKeys(html)) {
    const res = await fetchWithTimeout(
      `${SHOWROOM_STATUS_API}${encodeURIComponent(key)}`,
      { headers: { Accept: "application/json" } },
    ).catch(() => null);
    if (!res || !res.ok) continue;
    const status = await res.json().catch(() => null);
    const roomId = Number(status?.room_id);
    if (!Number.isInteger(roomId) || roomId <= 0) continue;
    if (!roomNameMatchesMily(status?.room_name)) continue;
    return {
      roomId,
      roomUrlKey: key,
      roomUrl: `https://www.showroom-live.com/r/${key}`,
      roomName: status.room_name,
    };
  }

  const matches = [];
  for (const candidateId of extractShowroomRoomIds(html).slice(0, 10)) {
    const res = await fetchWithTimeout(
      `${SHOWROOM_PROFILE_API}${candidateId}`,
      { headers: { Accept: "application/json" } },
    ).catch(() => null);
    if (!res || !res.ok) continue;
    const profile = await res.json().catch(() => null);
    // 別人のルームは採用しない
    if (!roomNameMatchesMily(profile?.room_name)) continue;
    const roomUrlKey =
      typeof profile.room_url_key === "string" ? profile.room_url_key : null;
    matches.push({
      roomId: candidateId,
      roomUrlKey,
      roomUrl: roomUrlKey
        ? `https://www.showroom-live.com/r/${roomUrlKey}`
        : `https://www.showroom-live.com/room/profile?room_id=${candidateId}`,
      roomName: profile.room_name,
    });
  }
  // 複数一致は曖昧なので採用しない
  return matches.length === 1 ? matches[0] : null;
}

async function main() {
  const checkedAt = new Date().toISOString();
  const findings = [];
  let html = null;

  try {
    const res = await fetchWithTimeout(contest.entryUrl, {
      headers: { Accept: "text/html" },
    });
    if (res.ok) {
      html = await res.text();
    } else {
      findings.push({
        severity: SEVERITY.unavailable,
        item: "ENTRY ページ",
        current: contest.entryUrl,
        observed: `HTTP ${res.status}`,
        note: "一時的な障害の可能性。SNS 削除などのデータ変更とは扱わない。",
      });
    }
  } catch (err) {
    findings.push({
      severity: SEVERITY.unavailable,
      item: "ENTRY ページ",
      current: contest.entryUrl,
      observed: `fetch error: ${err.message}`,
      note: "timeout / ネットワーク障害。データ変更とは扱わない。",
    });
  }

  if (html !== null && !looksLikeEntryPage(html)) {
    // 本人ページと確認できないので、ここから先の値は一切採用しない
    findings.push({
      severity: SEVERITY.identity,
      item: "ENTRY 734 の本人ページ判定",
      current: "みりぃ / 三橋 / Mily を含む ENTRY 734 ページ",
      observed: "本人表記を確認できず",
      note: "取得値は採用しない。ページ構成変更か、エントリー番号の割当変更の可能性。",
    });
    html = null;
  }

  let room = null;
  if (html !== null) {
    const observedSns = filterMilyLinks(extractSnsLinks(html));
    findings.push(...diffSnsLinks(socials, observedSns));

    room = await resolveRoom(html).catch(() => null);
    const registeredShowroom =
      socials.find((item) => item.platform === "showroom")?.url ?? null;
    findings.push(...diffShowroom(registeredShowroom, room));

    // フェーズ表記は、本人と確認できたルーム名からのみ読む
    findings.push(...diffPhase(contest.currentPhase?.name ?? null, room?.roomName ?? null));
  }

  // schedule endpoint の到達性（room が解決できたときだけ確認）
  if (room?.roomId) {
    const scheduleUrl = `${AGE_SCHEDULE_BASE}${room.roomId}.json`;
    try {
      const res = await fetchWithTimeout(scheduleUrl, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        findings.push({
          severity: SEVERITY.unavailable,
          item: "配信予定 endpoint",
          current: scheduleUrl,
          observed: `HTTP ${res.status}`,
          note: "配信予定の自動取得が一時的に失敗する可能性。サイトは手入力 fallback で動作する。",
        });
      } else {
        await res.json();
      }
    } catch (err) {
      findings.push({
        severity: SEVERITY.unavailable,
        item: "配信予定 endpoint",
        current: scheduleUrl,
        observed: `fetch/parse error: ${err.message}`,
        note: "一時障害または仕様変更の可能性。データ変更とは扱わない。",
      });
    }
  }

  const changed = hasChanges(findings);
  const fingerprintValue = fingerprint(findings);
  const title = changed
    ? `ENTRY 734 公開情報の変更を検出 (${fingerprintValue})`
    : "ENTRY 734 公開情報チェック: 変更なし";

  const body =
    findings.length === 0
      ? `- 検知日時: ${sanitizeValue(checkedAt, 40)}\n- 主ソース: ${sanitizeValue(
          contest.entryUrl,
          120,
        )}\n\n登録値と実ページの差分はありませんでした。`
      : renderReport({
          findings,
          checkedAt,
          entryUrl: contest.entryUrl,
          fingerprintValue,
        });

  const report = `## ${title}\n\n${body}\n`;
  console.log(report);

  if (process.env.WATCH_REPORT_PATH) {
    await writeFile(process.env.WATCH_REPORT_PATH, report, "utf8");
  }
  const outputPath = process.env.WATCH_OUTPUT_PATH ?? process.env.GITHUB_OUTPUT;
  if (outputPath) {
    await appendFile(
      outputPath,
      `has-changes=${changed ? "true" : "false"}\nfingerprint=${fingerprintValue}\ntitle=${title}\n`,
      "utf8",
    );
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, report, "utf8");
  }
}

await main();
