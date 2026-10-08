import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { news, newsDisplayMedia } from "../src/data/news.ts";
import {
  firstSeptemberTomatoBoardImage,
  firstSeptemberShowroomAdditionalMedia,
} from "../src/data/firstSeptemberShowroomImages.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";

const record = news.find(({ id }) => id === "2026-09-01-first-showroom-oyasumiry");
assert.ok(record);

describe("HOME / NEWS-only September 1 stills", () => {
  it("keeps the original NEWS card and six media objects while excluding Activity media", () => {
    assert.equal(selectActivityNews("live-stream", [record])[0], record);
    assert.deepEqual(newsDisplayMedia(record), [
      firstSeptemberTomatoBoardImage,
      ...firstSeptemberShowroomAdditionalMedia,
    ]);
    assert.deepEqual(
      selectActivityMedia("live-stream", { newsItems: [record], storyItems: [] }),
      [],
    );
  });

  it("leaves all other LIVE STREAM related media in their existing order", () => {
    const remainingNews = news.filter((item) => item !== record);
    assert.deepEqual(
      selectActivityMedia("live-stream"),
      selectActivityMedia("live-stream", { newsItems: remainingNews }),
    );
  });
});
