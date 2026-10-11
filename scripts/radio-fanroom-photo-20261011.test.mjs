import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { describe, it } from "node:test";
import { radioFanroomAftershowPhoto, radioFanroomAftershowNewsImage } from "../src/data/radioFanroomAftershowPhoto.ts";
import { radioEpisode20261011 } from "../src/data/radioEpisode20261011.ts";
import { news } from "../src/data/news.ts";
import { radioOct11Stories } from "../src/data/radioOct11Stories.ts";

const stem = "mily-b203-01-ssc-aftershow-duo";

describe("October 11 Fan Room post-show two-person photo", () => {
  it("uses real cropped photo derivatives, with no DM or UI screenshot", () => {
    assert.equal(radioFanroomAftershowPhoto.id, stem);
    assert.deepEqual(radioFanroomAftershowPhoto.widths, [480, 960, 1000]);
    assert.equal(radioFanroomAftershowPhoto.sourceDate, "2026-10-11");
    assert.equal(radioFanroomAftershowPhoto.sourceUrl, null);
    assert.equal(radioFanroomAftershowPhoto.published, true);
    for (const width of [480, 960, 1000]) {
      for (const ext of ["jpg", "webp"]) {
        const file = `public/media/gallery/${stem}-${width}.${ext}`;
        assert.ok(statSync(file).size > 8_000, file);
      }
    }
    const source = readFileSync("src/data/radioFanroomAftershowPhoto.ts", "utf8");
    assert.doesNotMatch(source, /画像生成|AIイラスト|ファンコメント転載|投稿者の本名|private\.jpeg|C:\\\\/);
  });

  it("shows the photograph in Gallery and today's radio recap", () => {
    const galleryPage = readFileSync("src/GalleryPage.tsx", "utf8");
    assert.match(galleryPage, /radioFanroomAftershowPhoto/);
    assert.match(galleryPage, /<figure/);
    assert.equal(radioEpisode20261011.aftershowPhoto?.src, `/media/gallery/${stem}-1000.jpg`);
    assert.match(radioEpisode20261011.aftershowPhoto?.caption ?? "", /13:12/);
    const page = readFileSync("src/ActivitiesPage.tsx", "utf8");
    assert.match(page, /episode\.aftershowPhoto/);
    assert.match(page, /<figure/);
  });

  it("preserves both preexisting Story videos, plus the one Fan Room photo in NEWS", () => {
    const promo = news.find((item) => item.id === "2026-10-11-radio-tournament-stories");
    assert.ok(promo);
    assert.equal(promo.media?.id, radioOct11Stories[0].id);
    assert.equal(promo.additionalMedia?.length, 2);
    assert.equal(promo.additionalMedia?.[0].id, radioOct11Stories[1].id);
    assert.equal(promo.additionalMedia?.[1].src, radioFanroomAftershowNewsImage.src);
    assert.equal(promo.additionalMedia?.[1].kind, "image");
    assert.match(promo.sourceLabel ?? "", /SHOWROOMファンルーム写真/);
    assert.match(promo.body, /13:12/);
    assert.ok(!promo.body.includes("あっきー"));
  });
});
