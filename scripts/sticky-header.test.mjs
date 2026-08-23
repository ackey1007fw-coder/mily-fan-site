import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

describe("sticky header scroll container", () => {
  it("clips horizontal overflow without creating a scrolling ancestor for the sticky header", () => {
    const app = source("src/App.tsx");
    const header = source("src/components/Header.tsx");

    assert.match(app, /overflow-x-clip/);
    assert.doesNotMatch(app, /overflow-x-hidden/);
    assert.match(header, /sticky top-0/);
  });
});
