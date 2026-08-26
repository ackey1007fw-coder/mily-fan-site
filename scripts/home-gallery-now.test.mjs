import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { radioProgram } from "../shared/radio-program.js";
import { contest } from "../src/data/contest.ts";
import { links } from "../src/data/links.ts";
import { supportEvents } from "../src/data/supportEvents.ts";
import {
  GALLERY_ARCHIVE_INITIAL,
  HOME_GALLERY_LIMIT,
  selectHomeVoteAction,
} from "../src/lib/homePortal.ts";
import {
  isDrivePortraitPhoto,
  isMilyPortraitPhoto,
  isObjectWithoutPerson,
  isRadioTrioPhoto,
  isShowroomUiScreenshot,
  isSkyOrLandscapePhoto,
  selectGalleryEntries,
  selectGalleryPreview,
} from "../src/lib/galleryItems.ts";
import { selectHomeToday } from "../src/lib/homeToday.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");
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

const NONE_BANNER = { kind: "NONE", stateLabel: "", title: "" };

function homeToday(now, overrides = {}) {
  return selectHomeToday({
    contest,
    supportEvents,
    streamSlots: [],
    streamRoomUrl: null,
    live: unknownLive,
    radio: null,
    radioPhase: "idle",
    banner: NONE_BANNER,
    now,
    ...overrides,
  });
}

function radioOnAir(now) {
  return {
    ok: true,
    programName: radioProgram.programName,
    todayScheduled: true,
    scheduledStart: radioProgram.scheduledStart,
    scheduledEnd: radioProgram.scheduledEnd,
    inScheduledWindow: true,
    schedulePhase: "window",
    nextStartAt: null,
    onAirConfirmed: true,
    milyAppearanceConfirmed: null,
    listenUrl: radioProgram.listenUrl,
    sourceUrl: radioProgram.nowOnAirSourceUrl,
    lastVerifiedAt: radioProgram.lastVerifiedAt,
    updatedAt: new Date(now).toISOString(),
  };
}

describe("HOME 今日のみりぃ — Paton vote window", () => {
  it("makes Paton the now-path primary CTA with a JST deadline during the window", () => {
    const during = homeToday(START);
    const vote = during.voteActions[0];
    const nowVote = during.nowItems.find((item) => item.cta?.url === PATON_URL);

    assert.equal(vote.kind, "support-event");
    assert.equal(vote.label, "Patonでみりぃに投票する");
    assert.equal(vote.url, PATON_URL);
    assert.match(vote.deadlineLabel ?? "", /投票締切/);
    assert.match(vote.deadlineLabel ?? "", /JST/);
    assert.ok(nowVote);
    assert.equal(nowVote.cta?.label, "Patonでみりぃに投票する");
    assert.match(nowVote.note ?? "", /投票締切/);
    assert.match(nowVote.note ?? "", /JST/);
    assert.equal(
      during.nowItems.filter((item) => item.cta?.url === PATON_URL).length,
      1,
    );
    assert.equal(
      during.voteActions.filter((action) => action.url === PATON_URL).length,
      1,
    );
  });

  it("does not leave a dead Paton button after 9/1 23:59 JST", () => {
    const ended = homeToday(END + 1);
    assert.equal(
      ended.nowItems.some((item) => item.cta?.url === PATON_URL),
      false,
    );
    assert.equal(
      ended.voteActions.some((action) => action.url === PATON_URL),
      false,
    );
    assert.equal(ended.voteActions.length, 1);
    assert.equal(ended.voteActions[0].kind, "contest");
    assert.equal(ended.voteActions[0].url, contest.entryUrl);
    assert.equal(ended.voteActions[0].label, "ENTRY 734を応援する");
    assert.equal(ended.voteActions[0].deadlineLabel, undefined);
    assert.match(ended.voteActions[0].note ?? "", /3次審査進出/);
  });

  it("keeps the live vote in the compact NOW cap even when SHOWROOM and radio are live", () => {
    const now = START;
    const live = {
      ...unknownLive,
      state: "live",
      roomUrl: "https://www.showroom-live.com/r/example",
    };
    const view = homeToday(now, {
      live,
      radio: radioOnAir(now),
      radioPhase: "window",
    });
    assert.equal(view.nowItems[0]?.cta?.url, PATON_URL);
    assert.ok(view.nowItems.length <= 2);
    assert.equal(
      view.nowItems.filter((item) => item.cta?.url === PATON_URL).length,
      1,
    );
  });

  it("derives the dashboard primary from the same vote selector, without stacking the URL", async () => {
    const dashboard = source("src/components/TodayDashboard.tsx");
    assert.match(dashboard, /voteActions/);
    assert.match(dashboard, /liveVoteOnNow/);
    assert.match(dashboard, /buttonActions/);
    assert.doesNotMatch(dashboard, /contest\.entryUrl/);
    assert.doesNotMatch(dashboard, /paton\.jp/);

    const during = homeToday(START);
    const ended = homeToday(END + 1);
    const duringNowUrls = during.nowItems.flatMap((item) =>
      item.cta ? [item.cta.url] : [],
    );
    const duringButtons = during.voteActions.filter(
      (action) => !duringNowUrls.includes(action.url),
    );
    assert.equal(duringNowUrls.includes(PATON_URL), true);
    assert.equal(
      duringButtons.some((action) => action.url === PATON_URL),
      false,
    );
    assert.equal(duringButtons[0]?.url, contest.entryUrl);

    const endedNowUrls = ended.nowItems.flatMap((item) =>
      item.cta ? [item.cta.url] : [],
    );
    assert.equal(endedNowUrls.includes(PATON_URL), false);
    assert.equal(ended.voteActions[0].url, contest.entryUrl);
  });
});

describe("Gallery portrait-first order", () => {
  it("leads HOME preview and the Gallery initial window with みりぃ portraits", () => {
    const preview = selectGalleryPreview(HOME_GALLERY_LIMIT);
    const initial = selectGalleryEntries().slice(0, GALLERY_ARCHIVE_INITIAL);

    assert.equal(preview.length, HOME_GALLERY_LIMIT);
    assert.equal(initial.length, GALLERY_ARCHIVE_INITIAL);

    for (const [label, window] of [
      ["preview", preview],
      ["initial", initial],
    ]) {
      assert.equal(
        window.some((entry) => entry.kind === "mixch"),
        false,
        `${label} must not lead with Mixch`,
      );
      for (const entry of window) {
        if (entry.kind === "media") {
          assert.equal(isMilyPortraitPhoto(entry.item), true, entry.key);
          assert.equal(isShowroomUiScreenshot(entry.item), false, entry.key);
          assert.equal(isRadioTrioPhoto(entry.item), false, entry.key);
          assert.equal(isSkyOrLandscapePhoto(entry.item), false, entry.key);
          assert.equal(isObjectWithoutPerson(entry.item), false, entry.key);
        } else {
          assert.equal(entry.kind, "drive-photo", entry.key);
          assert.equal(isDrivePortraitPhoto(entry.item), true, entry.key);
        }
      }
    }

    assert.deepEqual(
      preview.map((entry) => entry.key),
      [
        "mily-b31-01",
        "mily-b30-01",
        "mily-b29-01",
        "mily-b28-01",
        "mily-b27-07",
        "mily-b27-06",
      ],
    );
  });

  it("keeps Mixch, SHOWROOM screenshots, radio trio, and sky after portraits", () => {
    const entries = selectGalleryEntries();
    const firstMixch = entries.findIndex((entry) => entry.kind === "mixch");
    const firstPortraitEnd = entries.findIndex(
      (entry) =>
        (entry.kind === "media" && !isMilyPortraitPhoto(entry.item)) ||
        (entry.kind === "drive-photo" && !isDrivePortraitPhoto(entry.item)) ||
        entry.kind === "mixch" ||
        entry.kind === "video",
    );

    assert.ok(firstMixch > 0);
    assert.ok(firstPortraitEnd > 0);
    assert.ok(firstMixch >= firstPortraitEnd);

    const mixch = entries.filter((entry) => entry.kind === "mixch");
    assert.equal(mixch.length, 2);
    assert.equal(
      entries.some(
        (entry) =>
          entry.kind === "media" && isShowroomUiScreenshot(entry.item),
      ),
      true,
    );
    assert.equal(
      entries.some(
        (entry) => entry.kind === "media" && isSkyOrLandscapePhoto(entry.item),
      ),
      true,
    );
    assert.equal(entries.every((entry) => entry.key.length > 0), true);
  });

  it("does not unpublish items or copy media arrays into the selector", () => {
    const selector = source("src/lib/galleryItems.ts");
    assert.match(selector, /visibleMedia\(media\)/);
    assert.match(selector, /isMilyPortraitPhoto/);
    assert.doesNotMatch(selector, /basePath: "\/media\//);
    assert.doesNotMatch(selector, /const photos = \[/);
    assert.equal(
      selectGalleryEntries().filter((entry) => entry.kind === "mixch").length,
      2,
    );
  });
});

describe("confirmed Miss Circle third-round dates", () => {
  it("records official SCHEDULE dates and leaves SHOWROOM times unpublished", () => {
    assert.equal(contest.currentPhase?.name, "3次審査進出");
    assert.equal(contest.currentPhase?.start, "2026-09-03");
    assert.equal(contest.currentPhase?.end, "2026-09-13");
    assert.equal(contest.currentPhase?.source, "https://www.misscircle.jp/");
    assert.equal(contest.lastVerifiedAt, "2026-08-26");
    assert.doesNotMatch(JSON.stringify(contest.currentPhase), /12:00|05:00|21:59/);

    const afterPaton = selectHomeVoteAction({
      contest,
      supportEvents,
      links,
      now: END + 1,
    });
    assert.equal(afterPaton.url, contest.entryUrl);
    assert.match(afterPaton.note ?? "", /9\/3/);
    assert.match(afterPaton.note ?? "", /9\/13/);
  });
});
