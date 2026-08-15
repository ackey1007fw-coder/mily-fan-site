/**
 * ENTRY 734 → room解決 → SHOWROOM status → next_live → FM radio status
 * を実ネットワークで通しで確認する検証スクリプト（CI / 通常回線で実行）。
 *
 *   node --experimental-strip-types scripts/probe-live.mjs
 *
 * サイトの動作には使わない。room ID の推測もしない（api と同じ経路を通すだけ）。
 */
import {
  fetchNextLive,
  fetchShowroomStatus,
  resolveMilyRoom,
} from "../server/mily-showroom.js";
import { getLiveStatus } from "../api/mily-live.js";
import { fetchRadioStatus } from "../api/mily-radio-status.js";

console.log("--- 1. resolveMilyRoom (ENTRY 734 起点) ---");
const room = await resolveMilyRoom({}).catch((err) => {
  console.log("resolve error:", err.message);
  return null;
});
console.log(JSON.stringify(room, null, 2));

if (room) {
  console.log("--- 2. SHOWROOM status (is_live のみを見る) ---");
  console.log(JSON.stringify(await fetchShowroomStatus(room), null, 2));

  console.log("--- 3. SHOWROOM next_live (予定専用) ---");
  console.log(JSON.stringify(await fetchNextLive(room), null, 2));
}

console.log("--- 4. /api/mily-live のレスポンス ---");
console.log(JSON.stringify(await getLiveStatus({}), null, 2));

console.log("--- 5. /api/mily-radio-status のレスポンス ---");
console.log(JSON.stringify(await fetchRadioStatus(), null, 2));
