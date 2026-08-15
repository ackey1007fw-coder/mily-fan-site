/**
 * 配信予定の自動解決チェーンを「本物のネットワーク」で実行して結果を出力する
 * 検証スクリプト。CI（GitHub Actions）や手元の通常回線で実行する想定。
 *
 *   node scripts/probe-schedule.mjs
 *
 * サイトの動作には使われない（検証専用）。room ID の推測はここでも行わず、
 * ENTRY 734 ページ → SHOWROOM status API → AGE schedule JSON の順で
 * api/mily-schedule.js と同一のロジックを実行するだけ。
 */
import {
  extractShowroomKeys,
  extractShowroomRoomIds,
  extractSnsLinks,
  filterMilyLinks,
  looksLikeEntryPage,
  resolveAndFetchSchedule,
} from "../api/mily-schedule.js";

const ENTRY_URL = "https://2026.misscircle.jp/entry/734";

async function diagnostics() {
  try {
    const res = await fetch(ENTRY_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MilyFanSite/1.0; +https://mily-fan-site.vercel.app)",
        Accept: "text/html",
      },
    });
    console.log(`entry page: HTTP ${res.status}`);
    if (!res.ok) return;
    const html = await res.text();
    console.log(`entry page: ${html.length} bytes`);
    console.log(`looksLikeEntryPage: ${looksLikeEntryPage(html)}`);
    console.log("showroom keys:", JSON.stringify(extractShowroomKeys(html)));
    console.log(
      "showroom room_id candidates:",
      JSON.stringify(extractShowroomRoomIds(html)),
    );
    console.log(
      "mily sns links:",
      JSON.stringify(filterMilyLinks(extractSnsLinks(html)), null, 2),
    );
  } catch (err) {
    console.log(`entry page fetch failed: ${err.message}`);
  }
}

console.log("--- diagnostics ---");
await diagnostics();
console.log("--- resolveAndFetchSchedule ---");
const result = await resolveAndFetchSchedule({});
console.log(JSON.stringify(result, null, 2));
