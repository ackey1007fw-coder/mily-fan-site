import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUEN_ARCHIVE_URL = "https://ouen-archive-564c.vercel.app/";

function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("応援アーカイブ return link", () => {
  it("links back to the portal from the footer, in the same tab", async () => {
    const footer = await read("src/components/Footer.tsx");

    assert.match(footer, /応援アーカイブへ戻る/);
    assert.ok(
      footer.includes(`const OUEN_ARCHIVE_URL = "${OUEN_ARCHIVE_URL}"`),
      "footer must use the portal canonical production URL",
    );
    assert.match(footer, /href=\{OUEN_ARCHIVE_URL\}/);
    assert.doesNotMatch(footer, /target="_blank"/);
    assert.match(footer, /min-h-\[44px\]/);
    assert.match(footer, /underline/);
  });

  it("stays inside the footer element and below the disclaimer", async () => {
    const footer = await read("src/components/Footer.tsx");

    assert.ok(
      footer.indexOf("公式・公認・本人運営ではありません") <
        footer.indexOf("応援アーカイブへ戻る"),
      "the portal link must come after the site disclaimer",
    );
    assert.ok(
      footer.indexOf("応援アーカイブへ戻る") < footer.indexOf("</footer>"),
      "the portal link must live inside the footer element",
    );
  });

  it("keeps the existing footer content untouched", async () => {
    const footer = await read("src/components/Footer.tsx");

    assert.match(footer, /ファン制作の非公式サイト/);
    assert.match(footer, /公式・公認・本人運営ではありません/);
    assert.match(footer, /\{profile\.displayName\}/);
  });

  it("leaves the Portal Feed source untouched", async () => {
    const feed = await read("src/data/portalFeed.ts");

    assert.doesNotMatch(feed, /ouen-archive/);
    assert.match(feed, /siteUrl: canonicalUrl\(\)/);
  });
});
