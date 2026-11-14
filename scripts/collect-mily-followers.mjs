#!/usr/bin/env node
/**
 * みりぃダッシュボード用フォロワー・スナップショット収集（手動実行専用）。
 *
 * SHOWROOM公式プロフィールAPI（/api/room/profile）から現在の
 * follower_num / show_rank_subdivided / live_continuous_days を読み、
 * public/data-lab/data/mily-dashboard.json の profile と
 * followersHistory（JST日付で1日1行）へ反映する。
 *
 * - 定期実行はしない。実行は人の判断で行う。
 * - follower_num が数値で取れない場合は何も書かずに異常終了する
 *   （推測値・前回値で埋めない）。
 * - room は ENTRY 734 起点の自動解決ではなく、このダッシュボードの
 *   対象として確認済みの room_id 573253 を使う（収集対象の固定）。
 *
 * 使い方:
 *   node scripts/collect-mily-followers.mjs [--file <dashboard.json のパス>]
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOM_ID = 573253;
const PROFILE_URL = `https://www.showroom-live.com/api/room/profile?room_id=${ROOM_ID}`;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const fileFlag = args.indexOf("--file");
const target =
  fileFlag >= 0
    ? path.resolve(args[fileFlag + 1])
    : path.join(root, "public/data-lab/data/mily-dashboard.json");

function jstNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    iso: `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}+09:00`,
  };
}

const res = await fetch(PROFILE_URL, {
  headers: { Accept: "application/json", "User-Agent": "mily-fan-site-dashboard-collector" },
});
if (!res.ok) {
  console.error(`profile API failed: HTTP ${res.status}`);
  process.exit(1);
}
const profile = await res.json();
const followers = profile?.follower_num;
if (typeof followers !== "number" || !Number.isFinite(followers)) {
  console.error(
    "follower_num is missing or not a number in the profile API response; refusing to write a guessed value.",
  );
  process.exit(1);
}
if (profile.room_id !== ROOM_ID) {
  console.error(`unexpected room_id in response: ${profile.room_id}`);
  process.exit(1);
}

const now = jstNow();
const data = JSON.parse(await readFile(target, "utf8"));
if (data.schema !== "mily-dashboard-v1") {
  console.error(`unexpected dashboard schema: ${data.schema}`);
  process.exit(1);
}

data.profile = {
  ...data.profile,
  roomId: ROOM_ID,
  followers,
  showRank:
    typeof profile.show_rank_subdivided === "string"
      ? profile.show_rank_subdivided
      : null,
  liveContinuousDays:
    typeof profile.live_continuous_days === "number"
      ? profile.live_continuous_days
      : null,
  isOnlive: profile.is_onlive === true,
  observedDateJst: now.date,
  observedAtJst: now.iso,
  source:
    "SHOWROOM公式プロフィールAPI（/api/room/profile）の実測。follower_num / show_rank_subdivided / live_continuous_days を使用",
};

const row = {
  dateJst: now.date,
  followers,
  source: "SHOWROOM公式プロフィールAPI follower_num（実測）",
};
const history = Array.isArray(data.followersHistory) ? data.followersHistory : [];
const existing = history.findIndex((h) => h.dateJst === now.date);
if (existing >= 0) history[existing] = row;
else history.push(row);
history.sort((a, b) => (a.dateJst < b.dateJst ? -1 : 1));
data.followersHistory = history;
data.updatedDateJst = now.date;

await writeFile(target, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(
  `recorded ${now.date}: followers=${followers} rank=${data.profile.showRank} streak=${data.profile.liveContinuousDays}`,
);
