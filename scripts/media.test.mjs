import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { featuredPhoto, media, visibleMedia } from "../src/data/media.ts";
import { verifyMedia } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const validItem = {
  id: "fixture",
  kind: "photo",
  basePath: "/media/gallery/milly-b01-03-bouquet-smile",
  widths: [480, 960, 1600],
  width: 1600,
  height: 1200,
  alt: "花束を持った写真",
  provenance: "owner-provided",
  sourceUrl: null,
  sourceDate: null,
  credit: null,
  published: true,
};

describe("media collection", () => {
  it("accepts the live collection", () => {
    assert.deepEqual(verifyMedia(media), []);
  });

  it("enforces the milly- filename scheme", () => {
    assert.deepEqual(verifyMedia([validItem]), []);

    const errors = verifyMedia([
      { ...validItem, id: "bad", basePath: "/media/gallery/birthday" },
    ]);
    assert.ok(errors.some((error) => error.includes("milly-bNN-NN")));
  });

  it("requires a sourceUrl when provenance claims an SNS post", () => {
    const errors = verifyMedia([
      { ...validItem, id: "sns", provenance: "sns-post" },
    ]);
    assert.ok(errors.some((error) => error.includes("sourceUrl")));
  });

  it("rejects guessed source dates", () => {
    const errors = verifyMedia([
      { ...validItem, id: "date", sourceDate: "2026-02-30" },
    ]);
    assert.ok(errors.some((error) => error.includes("sourceDate")));
  });

  it("ships every derivative file for published photos", () => {
    for (const item of visibleMedia(media)) {
      if (item.kind !== "photo") continue;
      for (const width of item.widths) {
        for (const format of ["jpg", "webp"]) {
          const file = path.join(root, "public", `${item.basePath}-${width}.${format}`);
          assert.ok(existsSync(file), `missing ${item.basePath}-${width}.${format}`);
        }
      }
    }
  });

  it("only surfaces published items", () => {
    const items = visibleMedia([
      { ...validItem, id: "on" },
      { ...validItem, id: "off", published: false },
    ]);
    assert.deepEqual(items.map((item) => item.id), ["on"]);
  });

  it("never features an unpublished photo", () => {
    const photo = featuredPhoto(media);
    if (!photo) return;
    assert.equal(photo.published, true);
  });
});

describe("gallery provenance", () => {
  it("links to the source only when one is confirmed", async () => {
    const source = await readFile(
      path.join(root, "src/components/Gallery.tsx"),
      "utf8",
    );

    assert.match(source, /from "\.\/ExternalLink"/);
    assert.match(source, /visibleMedia\(media\)/);
    assert.match(source, /item\.sourceUrl \?/);
    assert.match(source, /href=\{item\.sourceUrl\}/);
    assert.match(source, /出典を見る/);
  });
});

describe("hero media wiring", () => {
  it("uses featuredPhoto and keeps the unofficial badge", async () => {
    const source = await readFile(path.join(root, "src/components/Hero.tsx"), "utf8");

    assert.match(source, /featuredPhoto/);
    assert.match(source, /ファン制作・非公式サイト/);
    assert.match(source, /href="#latest"/);
    assert.match(source, /href="#gallery"/);
  });

  it("keeps the unofficial disclaimer in the footer", async () => {
    const source = await readFile(
      path.join(root, "src/components/Footer.tsx"),
      "utf8",
    );
    assert.match(source, /公式・公認・本人運営ではありません/);
  });
});
