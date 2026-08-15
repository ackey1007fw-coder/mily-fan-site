import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contest } from "../src/data/contest.ts";
import { upcomingSlots } from "../src/data/streamSchedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

describe("today dashboard", () => {
  it("sits between the hero and the support section", async () => {
    const app = await read("src/App.tsx");
    const hero = app.indexOf("<Hero />");
    const dashboard = app.indexOf("<TodayDashboard />");
    const support = app.indexOf("<Support />");
    assert.ok(hero >= 0 && dashboard >= 0 && support >= 0);
    assert.ok(hero < dashboard && dashboard < support);
  });

  it("links to ENTRY 734 via the contest data", async () => {
    const source = await read("src/components/TodayDashboard.tsx");
    assert.match(source, /今日のみりぃ/);
    assert.match(source, /contest\.entryUrl/);
    assert.match(source, /ENTRY 734を応援する/);
    assert.equal(contest.entryUrl, "https://2026.misscircle.jp/entry/734");
  });

  it("reuses the shared schedule hook instead of hardcoding a room", async () => {
    const source = await read("src/components/TodayDashboard.tsx");
    assert.match(source, /useStreamSchedule/);
    assert.doesNotMatch(source, /\d{6}/);
    assert.doesNotMatch(source, /marquez\.age\.co\.jp/);
  });

  it("shows stream and phase info only when it exists", async () => {
    const source = await read("src/components/TodayDashboard.tsx");
    assert.match(source, /next \?/);
    assert.match(source, /contest\.currentPhase \?/);
    assert.match(source, /showroomUrl \?/);
    assert.match(source, /配信中の時間帯/);
    assert.doesNotMatch(source, /(?:^|[^配信中の時間帯])LIVE/);
  });

  it("survives an empty or junk schedule", () => {
    assert.deepEqual(upcomingSlots([], []), []);
    assert.deepEqual(
      upcomingSlots([], [null, "junk", { date: "bad", time: "99:99" }]),
      [],
    );
  });

  it("keeps unverified contest fields null instead of guessing", () => {
    assert.equal(contest.contestName, "MISS CIRCLE CONTEST 2026");
    assert.equal(contest.entryNumber, "ENTRY 734");
    assert.match(contest.lastVerifiedAt, DATE_RE);
    if (contest.currentPhase !== null) {
      assert.ok(contest.currentPhase.name.length > 0);
      assert.match(contest.currentPhase.source, /^https:\/\//);
      for (const value of [contest.currentPhase.start, contest.currentPhase.end]) {
        assert.ok(value === null || DATE_RE.test(value));
      }
    }
  });

  it("coexists with the mobile fixed CTA", async () => {
    const app = await read("src/App.tsx");
    assert.match(app, /<MobileActionDock \/>/);
    assert.match(app, /pb-20/);
  });
});
