import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("profile fact provenance", () => {
  it("shows each fact's label, value, and source via ExternalLink", async () => {
    const source = await readFile(path.join(root, "src/components/About.tsx"), "utf8");

    assert.match(source, /from "\.\/ExternalLink"/);
    assert.match(source, /fact\.label/);
    assert.match(source, /fact\.value/);
    assert.match(source, /fact\.source/);
    assert.match(source, /href=\{fact\.source\}/);
    assert.match(source, /出典を見る/);
  });
});

describe("highlight provenance", () => {
  it("shows each highlight's year, title, body, and source via ExternalLink", async () => {
    const source = await readFile(path.join(root, "src/components/About.tsx"), "utf8");

    assert.match(source, /highlights\.map\(\(item\) =>/);
    assert.match(source, /item\.year/);
    assert.match(source, /item\.title/);
    assert.match(source, /item\.body/);
    assert.match(source, /href=\{item\.source\}/);
    assert.match(source, /出典を見る/);
  });
});
