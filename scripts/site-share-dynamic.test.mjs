import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { site } from "../src/data/site.ts";
import {
  siteSharePayload,
  siteShareText,
} from "../src/lib/siteShare.ts";

const at = (value) => Date.parse(value);

describe("date-aware site share copy", () => {
  it("combines today's radio, active Paton vote, and upcoming third round", () => {
    const text = siteShareText({
      now: at("2026-08-30T08:30:00+09:00"),
      radioPhase: "upcoming",
    });

    assert.match(text, /今日10:00〜は「湘南シーサイドサークル」📻/);
    assert.match(text, /CAMPUS GIRLS 2027のPaton投票をお願いします🗳️/);
    assert.match(text, /9\/1 23:59まで/);
    assert.match(text, /9\/3からMISS CIRCLE CONTEST 2026の3次審査が始まります🔥/);
    assert.ok(text.indexOf("湘南シーサイドサークル") < text.indexOf("Paton投票"));
    assert.ok(text.indexOf("Paton投票") < text.indexOf("3次審査"));
  });

  it("describes the radio slot without claiming Mily's live appearance", () => {
    const text = siteShareText({
      now: at("2026-08-30T11:00:00+09:00"),
      radioPhase: "window",
    });

    assert.match(text, /ただいま「湘南シーサイドサークル」の放送時間です📻/);
    assert.doesNotMatch(text, /みりぃ.*出演中|本人.*出演中|Mily.*出演中/);
  });

  it("drops the radio after its Sunday window but keeps live campaigns", () => {
    const text = siteShareText({
      now: at("2026-08-30T13:00:00+09:00"),
      radioPhase: "ended",
    });

    assert.doesNotMatch(text, /湘南シーサイドサークル/);
    assert.match(text, /Paton投票/);
    assert.match(text, /3次審査/);
  });

  it("ends Paton automatically and switches to the third-round callout", () => {
    const before = siteShareText({
      now: at("2026-09-02T12:00:00+09:00"),
      radioPhase: "idle",
    });
    assert.doesNotMatch(before, /Paton投票/);
    assert.match(before, /9\/3からMISS CIRCLE CONTEST 2026の3次審査/);

    const active = siteShareText({
      now: at("2026-09-03T00:00:00+09:00"),
      radioPhase: "idle",
    });
    assert.match(active, /MISS CIRCLE CONTEST 2026の3次審査を応援してください🔥/);
    assert.match(active, /9\/13まで/);
    assert.doesNotMatch(active, /Paton投票/);
  });

  it("returns the stable site description when no timely topic is active", () => {
    assert.equal(
      siteShareText({
        now: at("2026-09-14T12:00:00+09:00"),
        radioPhase: "idle",
      }),
      site.description,
    );
  });

  it("keeps the current X-ready payload comfortably below 280 characters", () => {
    const payload = siteSharePayload({
      now: at("2026-08-30T08:30:00+09:00"),
      radioPhase: "upcoming",
    });

    assert.ok(payload.text.length + 24 < 280);
  });
});
