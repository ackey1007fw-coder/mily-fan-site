import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { activities } from "../src/data/activities.ts";
import { contest } from "../src/data/contest.ts";
import {
  campusGirlsPatonVoteLink,
  links,
} from "../src/data/links.ts";
import { news } from "../src/data/news.ts";
import {
  campusGirlsFinalStagePatonVote,
  isValidSupportEvent,
  supportEvents,
} from "../src/data/supportEvents.ts";
import { selectHomeVoteAction } from "../src/lib/homePortal.ts";
import { selectSupportNow } from "../src/lib/supportHub.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PATON_URL = "https://paton.jp/event/entrant/11380";
const START = Date.parse("2026-08-26T18:00:00+09:00");
const END = Date.parse("2026-09-01T23:59:00+09:00");
const unknownLive = {
  state: "unknown",
  startedAt: null,
  observedAt: null,
  roomUrl: null,
  next: { state: "unknown", at: null },
};

async function source(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("2026-08-26 CAMPUS GIRLS Paton vote", () => {
  it("registers the confirmed entrant URL and timed voting period once", () => {
    assert.equal(campusGirlsPatonVoteLink.url, PATON_URL);
    assert.equal(campusGirlsPatonVoteLink.label, "Patonでみりぃに投票する");
    assert.equal(
      links.filter(({ id }) => id === campusGirlsPatonVoteLink.id).length,
      1,
    );

    assert.equal(isValidSupportEvent(campusGirlsFinalStagePatonVote), true);
    assert.equal(campusGirlsFinalStagePatonVote.activityId, "campus-girls");
    assert.equal(campusGirlsFinalStagePatonVote.kind, "vote");
    assert.deepEqual(campusGirlsFinalStagePatonVote.schedule, {
      state: "confirmed-period",
      start: "2026-08-26T18:00:00+09:00",
      end: "2026-09-01T23:59:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });
    assert.equal(campusGirlsFinalStagePatonVote.ctaLinkId, campusGirlsPatonVoteLink.id);
    assert.equal(campusGirlsFinalStagePatonVote.source, "https://paton.jp/event/detail/499");
    assert.equal(campusGirlsFinalStagePatonVote.verifiedAt, "2026-08-26");
  });

  it("uses Paton only during the confirmed period and falls back afterward", () => {
    const select = (now) =>
      selectHomeVoteAction({ contest, supportEvents, links, now });

    assert.equal(select(START - 1).url, contest.entryUrl);
    assert.deepEqual(
      [select(START), select(END)].map(({ kind, url }) => ({ kind, url })),
      [
        { kind: "support-event", url: PATON_URL },
        { kind: "support-event", url: PATON_URL },
      ],
    );
    assert.equal(select(END + 1).url, contest.entryUrl);
  });

  it("surfaces the same CTA in Support NOW while voting is live", () => {
    const items = selectSupportNow({
      supportEvents,
      live: unknownLive,
      radio: null,
      now: START,
    });

    assert.equal(items.length, 1);
    assert.equal(items[0].activityId, "campus-girls");
    assert.equal(items[0].cta?.url, PATON_URL);
    assert.equal(items[0].cta?.label, "Patonでみりぃに投票する");
    assert.match(items[0].note ?? "", /Patonへのログインが必要/);
  });

  it("links the CAMPUS GIRLS activity and existing NEWS card to Paton", () => {
    const activity = activities.find(({ id }) => id === "campus-girls");
    const item = news.find(
      ({ id }) => id === "2026-08-24-campus-girls-final-stage-guide",
    );

    assert.ok(activity?.relatedLinkIds.includes(campusGirlsPatonVoteLink.id));
    assert.equal(item?.url, PATON_URL);
    assert.equal(item?.ctaLabel, "Patonでみりぃに投票する");
    assert.match(item?.body ?? "", /8月26日にPatonの三橋莉子（みりぃ）ページの公開を確認/);
    assert.match(item?.body ?? "", /投票にはPatonへのログインが必要/);
  });

  it("wires the home CTAs through one selector without duplicating the URL", async () => {
    for (const relative of [
      "src/components/Hero.tsx",
      "src/components/Support.tsx",
      "src/components/MobileActionDock.tsx",
    ]) {
      const component = await source(relative);
      assert.match(component, /selectHomeVoteAction/);
      assert.match(component, /voteAction\.url/);
      assert.doesNotMatch(component, /paton\.jp/);
    }

    const dock = await source("src/components/MobileActionDock.tsx");
    assert.match(dock, /target="_blank"/);
    assert.match(dock, /rel="noopener noreferrer"/);
  });
});
