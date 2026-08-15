import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { featuredPhoto, media } from "../src/data/media.ts";
import { verifyMedia } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("media collection", () => {
  it("accepts the live collection, including when it is still empty", () => {
    assert.deepEqual(verifyMedia(media), []);
  });

  it("keeps local photo filenames on the mily- prefix", () => {
    assert.deepEqual(
      verifyMedia([
        {
          id: "ok-photo",
          kind: "photo",
          src: "/media/mily-birthday-bouquet.webp",
          alt: "花束を持った写真",
          source: "https://www.instagram.com/p/DbiY3PHk1c8/",
        },
      ]),
      [],
    );

    const errors = verifyMedia([
      {
        id: "bad-photo",
        kind: "photo",
        src: "/media/birthday.webp",
        alt: "花束を持った写真",
        source: "https://www.instagram.com/p/DbiY3PHk1c8/",
      },
    ]);
    assert.ok(errors.some((error) => error.includes("mily-")));
  });

  it("points featured hero photos at a real local file when one is selected", () => {
    const photo = featuredPhoto(media);
    if (!photo) return;

    assert.equal(photo.src.startsWith("/"), true);
    assert.equal(existsSync(path.join(root, "public", photo.src)), true);
  });

  it("registers the birthday photos with one featured hero image", () => {
    const photos = media.filter((item) => item.kind === "photo");
    const featured = photos.filter((item) => item.featured);

    assert.ok(photos.length >= 4);
    assert.equal(featured.length, 1);
    assert.equal(featured[0].src, "/media/mily-birthday-21-01.jpg");
    assert.equal(media.filter((item) => item.kind === "video").length, 0);

    for (const item of photos) {
      assert.equal(item.src.startsWith("/media/mily-"), true);
      assert.equal(item.source, "https://www.instagram.com/p/DbiY3PHk1c8/");
      assert.equal(existsSync(path.join(root, "public", item.src)), true);
      assert.doesNotMatch(item.alt, /幸せそう|嬉しそう|最高の気分/);
      assert.doesNotMatch(item.caption ?? "", /幸せそう|嬉しそう|最高の気分/);
    }
  });
});

describe("gallery provenance", () => {
  it("shows each media item's source via ExternalLink", async () => {
    const source = await readFile(
      path.join(root, "src/components/Gallery.tsx"),
      "utf8",
    );

    assert.match(source, /from "\.\/ExternalLink"/);
    assert.match(source, /visibleMedia\(media\)/);
    assert.match(source, /href=\{item\.source\}/);
    assert.match(source, /出典を見る/);
    assert.match(source, /object-contain/);
    assert.doesNotMatch(source, /object-cover/);
  });
});

describe("hero media wiring", () => {
  it("uses featuredPhoto and keeps unofficial wording", async () => {
    const source = await readFile(path.join(root, "src/components/Hero.tsx"), "utf8");

    assert.match(source, /featuredPhoto/);
    assert.match(source, /ファン制作・非公式サイト/);
    assert.match(source, /href="#support"/);
    assert.match(source, /href="#latest"/);
    assert.match(source, /公式・公認・本人運営ではありません/);
  });
});
