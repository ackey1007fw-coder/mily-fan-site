import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contest } from "../src/data/contest.ts";
import { links } from "../src/data/links.ts";
import { socials } from "../src/data/socials.ts";
import {
  isValidSlot,
  upcomingSlots,
  VISIBLE_AFTER_START_MS,
} from "../src/data/streamSchedule.ts";
import {
  extractShowroomKeys,
  extractShowroomRoomIds,
  extractSnsLinks,
  filterMilyLinks,
  looksLikeEntryPage,
  normalizeSchedule,
  roomNameMatchesMily,
} from "../api/mily-schedule.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENTRY_URL = "https://2026.misscircle.jp/entry/734";

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("ENTRY 734 funnel", () => {
  it("keeps the entry CTA in the hero, sourced from contest.ts", async () => {
    const hero = await read("src/components/Hero.tsx");
    assert.match(hero, /contest\.entryUrl/);
    assert.match(hero, /HOME_VOTE_CTA/);
    assert.match(hero, /contest\.entryNumber/);
  });

  it("keeps an entry CTA in the compact support gateway", async () => {
    const support = await read("src/components/Support.tsx");
    assert.match(support, /contest\.entryUrl/);
    assert.match(support, /SUPPORT_HUB_ROUTE/);
  });

  it("keeps the entry CTA in the mobile action dock", async () => {
    const dock = await read("src/components/MobileActionDock.tsx");
    const app = await read("src/App.tsx");
    assert.match(dock, /contest\.entryUrl/);
    assert.match(dock, /noopener noreferrer/);
    assert.match(dock, /sm:hidden/);
    assert.match(app, /<MobileActionDock \/>/);
  });
});

describe("SNS registry stays verified-only", () => {
  it("keeps X and Instagram and adds no unverified accounts", () => {
    assert.ok(
      socials.some(
        (item) => item.url === "https://www.instagram.com/mily_chan36",
      ),
    );
    assert.ok(socials.some((item) => item.url === "https://x.com/Mily_chan36"));
    assert.ok(
      socials.some((item) => item.url === "https://www.tiktok.com/@mily_chan36"),
    );
    assert.ok(
      socials.some(
        (item) => item.url === "https://www.showroom-live.com/r/circle2026_0734",
      ),
    );
    assert.ok(
      socials.some((item) => item.url === "https://mixch.tv/u/10114673"),
    );
    for (const item of socials) {
      assert.equal(item.confirmed, true);
      assert.match(item.url, /^https:\/\//);
    }
  });

  it("links to the Mily FM profile and program pages", () => {
    assert.ok(
      links.some((item) =>
        item.url.startsWith("https://fm-smw.jp/staff/mily"),
      ),
    );
    assert.ok(
      links.some((item) => item.url.startsWith("https://fm-smw.jp/program/")),
    );
  });
});

describe("stream schedule safety", () => {
  const base = Date.parse("2026-08-15T12:00:00+09:00");

  it("rejects invalid dates and times", () => {
    assert.equal(isValidSlot({ date: "2026-02-30", time: "22:00" }), false);
    assert.equal(isValidSlot({ date: "2026-08-16", time: "24:10" }), false);
    assert.equal(isValidSlot({ date: "8/16", time: "22:00" }), false);
    assert.equal(isValidSlot({ date: "2026-08-16", time: "22:30" }), true);
  });

  it("dedupes manual and auto slots, manual first", () => {
    const slots = upcomingSlots(
      [{ date: "2026-08-16", time: "22:30", note: "手入力" }],
      [
        { date: "2026-08-16", time: "22:30" },
        { date: "2026-08-17", time: "21:00" },
      ],
      base,
    );
    assert.equal(slots.length, 2);
    assert.equal(slots[0].note, "手入力");
  });

  it("hides slots roughly three hours after they start", () => {
    const slots = upcomingSlots(
      [
        { date: "2026-08-15", time: "08:00" },
        { date: "2026-08-15", time: "10:00" },
      ],
      [],
      base,
    );
    assert.equal(slots.length, 1);
    assert.equal(slots[0].time, "10:00");
    assert.ok(VISIBLE_AFTER_START_MS >= 3 * 60 * 60 * 1000);
  });

  it("sorts by start time and drops junk from the auto feed", () => {
    const slots = upcomingSlots(
      [],
      [
        { date: "2026-08-18", time: "21:00" },
        { date: "2026-08-16", time: "11:30" },
        { date: "bad", time: "99:99" },
        null,
        "junk",
      ],
      base,
    );
    assert.deepEqual(
      slots.map((slot) => `${slot.date}T${slot.time}`),
      ["2026-08-16T11:30", "2026-08-18T21:00"],
    );
  });

  it("keeps the UI safe when the auto fetch fails", async () => {
    const hook = await read("src/lib/useStreamSchedule.ts");
    assert.match(hook, /\.catch\(/);
    assert.match(hook, /Asia\/Tokyo/);
    assert.match(hook, /url\.origin === "https:\/\/www\.showroom-live\.com"/);
    assert.match(hook, /url\.username === ""/);
    assert.match(hook, /url\.password === ""/);

    const component = await read("src/components/StreamSchedule.tsx");
    assert.match(component, /useStreamSchedule/);
    assert.match(component, /return null/);
    assert.match(component, /配信予定は変更になる場合があります/);
    assert.match(component, /本日/);
  });

  it("normalizes the external schedule JSON defensively", () => {
    assert.deepEqual(normalizeSchedule(null), []);
    assert.deepEqual(normalizeSchedule({ not: "an array" }), []);
    const slots = normalizeSchedule([
      { start_date: "2026-08-16", start_hour: 22, start_minute: 30 },
      { start_date: "2026-08-16", start_hour: 22, start_minute: 30 },
      { start_date: "2026-08-16", start_hour: 30, start_minute: 0 },
      { start_date: "not-a-date", start_hour: 10, start_minute: 0 },
    ]);
    assert.deepEqual(slots, [{ date: "2026-08-16", time: "22:30" }]);
  });

  it("does not hardcode a guessed room id in the API", async () => {
    const api = await read("api/mily-schedule.js");
    assert.match(api, /MILY_SCHEDULE_URL/);
    assert.doesNotMatch(api, /marquez\.age\.co\.jp\/schedule\/\d/);
    assert.doesNotMatch(api, /room_url_key=[A-Za-z0-9]/);
    assert.match(api, /s-maxage=180,stale-while-revalidate=600/);

    // room 解決と env fallback は共有モジュール側（本人確認つき）
    const shared = await read("server/mily-showroom.js");
    assert.match(shared, /MILY_SHOWROOM_ROOM_ID/);
    assert.doesNotMatch(shared, /573253|circle2026_0734/);
  });

  it("resolves the room from the entry page, not from guesses", () => {
    const html = [
      '<html><body>ENTRY 734 みりぃ（三橋莉子）',
      '<a href="https://www.showroom-live.com/r/mily_room_key">SHOWROOM</a>',
      '<a href="https://www.showroom-live.com/room/profile?room_id=573963">SHOWROOM</a>',
      '{"sns":[{"url":"https:\\/\\/x.com\\/Mily_chan36"},',
      '{"url":"https:\\/\\/www.tiktok.com\\/@example_account"}]}',
      "</body></html>",
    ].join("");

    assert.equal(looksLikeEntryPage(html), true);
    assert.equal(looksLikeEntryPage("<html>まったく別のページ</html>"), false);

    assert.deepEqual(extractShowroomKeys(html), ["mily_room_key"]);
    assert.deepEqual(extractShowroomKeys("<html>no links</html>"), []);

    assert.deepEqual(extractShowroomRoomIds(html), [573963]);
    assert.deepEqual(extractShowroomRoomIds("<html>no ids</html>"), []);

    const sns = extractSnsLinks(html);
    assert.ok(sns.includes("https://x.com/Mily_chan36"));
    assert.ok(sns.includes("https://www.tiktok.com/@example_account"));

    const milyOnly = filterMilyLinks(sns);
    assert.ok(milyOnly.includes("https://x.com/Mily_chan36"));
    assert.ok(!milyOnly.includes("https://www.tiktok.com/@example_account"));

    assert.equal(roomNameMatchesMily("【MISS CIRCLE】みりぃ"), true);
    // 単独の "Mily" は弱いシグナル。ENTRY 734 の裏付けがある時だけ採用する。
    assert.equal(roomNameMatchesMily("Mily room"), false);
    assert.equal(roomNameMatchesMily("Mily room", "circle2026_0734"), true);
    assert.equal(roomNameMatchesMily("別人のルーム"), false);
    assert.equal(roomNameMatchesMily(undefined), false);
  });

  it("links the stream section to the entry page", async () => {
    const component = await read("src/components/StreamSchedule.tsx");
    assert.match(component, /contest\.entryUrl/);
  });
});

describe("follow section", () => {
  it("renders compact personal socials without mixing program links", async () => {
    const source = await read("src/components/Socials.tsx");
    assert.match(source, /HOME_FOLLOW_HEADING/);
    assert.match(source, /HOME_FOLLOW_PLATFORMS/);
    assert.match(source, /socials\.find/);
    assert.match(source, /activities\.find/);
    assert.doesNotMatch(source, /miss-circle-2026-734/);
    assert.doesNotMatch(source, /エントリーページへ/);
    assert.doesNotMatch(source, /FM湘南マジックウェイブ/);
    assert.doesNotMatch(source, /from "\.\.\/data\/links"/);
  });
});

describe("structured data", () => {
  it("declares unofficial WebSite and confirmed Person sameAs in JSON-LD", async () => {
    const html = await read("index.html");
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /"name": "みりぃ ファンサイト（非公式）"/);
    assert.match(html, /https:\/\/x\.com\/Mily_chan36/);
    assert.match(html, /https:\/\/www\.tiktok\.com\/@mily_chan36/);
    assert.match(html, /https:\/\/www\.showroom-live\.com\/r\/circle2026_0734/);
    assert.match(html, /https:\/\/mixch\.tv\/u\/10114673/);
    assert.match(html, /https:\/\/2026\.misscircle\.jp\/entry\/734/);
  });
});

describe("entry url consistency", () => {
  it("keeps contest.ts as the only place that stores the entry URL", async () => {
    const contestSource = await read("src/data/contest.ts");
    const contestUrls =
      contestSource.match(/https:\/\/2026\.misscircle\.jp\/entry\/\d+/g) ?? [];
    assert.ok(contestUrls.length > 0, "contest.ts should store the entry URL");
    for (const url of contestUrls) {
      assert.equal(url, ENTRY_URL, `src/data/contest.ts links ${url}`);
    }
    assert.equal(contest.entryUrl, ENTRY_URL);

    for (const relative of [
      "src/components/Hero.tsx",
      "src/components/Support.tsx",
      "src/components/MobileActionDock.tsx",
      "src/components/StreamSchedule.tsx",
      "src/components/TodayDashboard.tsx",
    ]) {
      const source = await read(relative);
      assert.match(
        source,
        /contest\.entryUrl/,
        `${relative} should read the entry URL from contest.ts`,
      );
      assert.deepEqual(
        source.match(/https:\/\/2026\.misscircle\.jp\/entry\/\d+/g) ?? [],
        [],
        `${relative} should not repeat the entry URL literal`,
      );
    }
  });
});
