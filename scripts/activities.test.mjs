import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { activities } from "../src/data/activities.ts";
import { highlights } from "../src/data/highlights.ts";
import { links } from "../src/data/links.ts";
import { profileSources } from "../src/data/profile.ts";
import { socials } from "../src/data/socials.ts";
import { stories } from "../src/data/stories.ts";

const forbiddenFields = new Set([
  "currentPhase",
  "statusLabel",
  "progressLabel",
  "currentRank",
  "rank",
  "active",
  "ongoing",
  "now",
  "currentEvent",
  "start",
  "end",
  "deadline",
  "newsIds",
  "galleryIds",
]);

describe("Activity identity foundation", () => {
  it("keeps ids and routes unique", () => {
    assert.deepEqual(
      activities.map(({ id }) => id),
      ["miss-circle", "radio", "live-stream", "campus-girls"],
    );
    assert.equal(new Set(activities.map(({ id }) => id)).size, activities.length);
    assert.equal(new Set(activities.map(({ route }) => route)).size, activities.length);
  });

  it("references only existing source, social, link, highlight, and story ids", () => {
    const sourceIds = new Set(Object.keys(profileSources));
    const socialIds = new Set(socials.map(({ id }) => id));
    const linkIds = new Set(links.map(({ id }) => id));
    const highlightIds = new Set(highlights.map(({ id }) => id));
    const storySlugs = new Set(stories.map(({ slug }) => slug));

    for (const activity of activities) {
      for (const id of activity.sourceIds) assert.ok(sourceIds.has(id), id);
      for (const id of activity.relatedSocialIds) assert.ok(socialIds.has(id), id);
      for (const id of activity.relatedLinkIds) assert.ok(linkIds.has(id), id);
      for (const id of activity.relatedHighlightIds) assert.ok(highlightIds.has(id), id);
      for (const slug of activity.relatedStorySlugs) assert.ok(storySlugs.has(slug), slug);
    }
  });

  it("stores no current state, rank, or schedule fields", () => {
    for (const activity of activities) {
      for (const key of Object.keys(activity)) {
        assert.equal(forbiddenFields.has(key), false, `${activity.id}.${key}`);
      }
    }
  });
});
