import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SEVERITY,
  diffPhase,
  diffShowroom,
  diffSnsLinks,
  fingerprint,
  hasChanges,
  normalizeUrl,
  platformOf,
  renderReport,
  sanitizeValue,
} from "./watch-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const registered = [
  { platform: "x", url: "https://x.com/Mily_chan36" },
  { platform: "instagram", url: "https://www.instagram.com/mily_chan36" },
  { platform: "tiktok", url: "https://www.tiktok.com/@mily_chan36" },
  { platform: "showroom", url: "https://www.showroom-live.com/r/circle2026_0734" },
];

const observedSame = [
  "https://x.com/mily_chan36",
  "https://www.instagram.com/mily_chan36/",
  "https://www.tiktok.com/@mily_chan36",
];

describe("url normalization", () => {
  it("absorbs case, www and trailing slash differences", () => {
    assert.equal(
      normalizeUrl("https://X.com/Mily_chan36"),
      normalizeUrl("https://x.com/mily_chan36/"),
    );
    assert.equal(
      normalizeUrl("https://www.instagram.com/mily_chan36"),
      normalizeUrl("https://instagram.com/mily_chan36/"),
    );
    assert.equal(normalizeUrl("javascript:alert(1)"), null);
    assert.equal(normalizeUrl(null), null);
  });

  it("maps urls to platforms", () => {
    assert.equal(platformOf("https://x.com/a"), "x");
    assert.equal(platformOf("https://twitter.com/a"), "x");
    assert.equal(platformOf("https://www.tiktok.com/@a"), "tiktok");
    assert.equal(platformOf("https://example.com/a"), null);
  });
});

describe("sns diffing", () => {
  it("reports no change when the values match", () => {
    const findings = diffSnsLinks(registered, observedSame);
    assert.deepEqual(findings, []);
    assert.equal(hasChanges(findings), false);
  });

  it("detects a changed url", () => {
    const findings = diffSnsLinks(registered, [
      ...observedSame.slice(1),
      "https://x.com/mily_new_handle",
    ]);
    const change = findings.find((item) => item.item.includes("x"));
    assert.equal(change.severity, SEVERITY.change);
    assert.equal(change.observed, "https://x.com/mily_new_handle");
    assert.equal(hasChanges(findings), true);
  });

  it("flags a newly published sns as a change, not a silent add", () => {
    const findings = diffSnsLinks(
      registered.filter((item) => item.platform !== "tiktok"),
      observedSame,
    );
    const added = findings.find((item) => item.item.includes("未登録"));
    assert.equal(added.severity, SEVERITY.change);
    assert.equal(added.current, null);
  });

  it("treats a missing link as unavailable rather than deleted", () => {
    const findings = diffSnsLinks(registered, [observedSame[0]]);
    for (const finding of findings) {
      assert.equal(finding.severity, SEVERITY.unavailable);
    }
    assert.equal(hasChanges(findings), false);
  });
});

describe("showroom diffing", () => {
  const resolved = {
    roomId: 573253,
    roomUrlKey: "circle2026_0734",
    roomUrl: "https://www.showroom-live.com/r/circle2026_0734",
    roomName: "🔥2次審査🩵三橋莉子🍅✨ #ミスサークル2026",
  };

  it("reports no change for the registered room", () => {
    assert.deepEqual(diffShowroom(registered[3].url, resolved), []);
  });

  it("detects a different room", () => {
    const findings = diffShowroom(registered[3].url, {
      ...resolved,
      roomId: 999999,
      roomUrlKey: "circle2026_9999",
      roomUrl: "https://www.showroom-live.com/r/circle2026_9999",
    });
    assert.equal(findings[0].severity, SEVERITY.change);
  });

  it("treats an unresolved room as unavailable, not as a deletion", () => {
    const findings = diffShowroom(registered[3].url, null);
    assert.equal(findings[0].severity, SEVERITY.unavailable);
    assert.equal(hasChanges(findings), false);
  });
});

describe("phase diffing", () => {
  it("passes when the public text still contains the registered phase", () => {
    assert.deepEqual(
      diffPhase("2次審査", "🔥2次審査🩵三橋莉子🍅✨ #ミスサークル2026"),
      [],
    );
  });

  it("detects a phase change", () => {
    const findings = diffPhase("2次審査", "🔥3次審査🩵三橋莉子✨");
    assert.equal(findings[0].severity, SEVERITY.change);
    assert.equal(hasChanges(findings), true);
  });

  it("treats a missing phase text as unavailable", () => {
    const findings = diffPhase("2次審査", null);
    assert.equal(findings[0].severity, SEVERITY.unavailable);
    assert.equal(hasChanges(findings), false);
  });
});

describe("issue payload safety", () => {
  it("neutralizes markdown and control characters from external text", () => {
    const dirty = "`rm -rf /`\n| broken | table |\n<script>alert(1)</script>";
    const clean = sanitizeValue(dirty);
    assert.doesNotMatch(clean, /`/);
    assert.doesNotMatch(clean, /\n/);
    assert.doesNotMatch(clean, /[<>]/);
    assert.doesNotMatch(clean, /\|/);
  });

  it("truncates very long values", () => {
    assert.ok(sanitizeValue("a".repeat(500), 50).length <= 51);
  });

  it("keeps a stable fingerprint for the same change set", () => {
    const findings = diffSnsLinks(registered, [
      ...observedSame.slice(1),
      "https://x.com/mily_new_handle",
    ]);
    const other = diffSnsLinks(registered, [
      "https://x.com/mily_new_handle",
      ...observedSame.slice(1),
    ]);
    assert.equal(fingerprint(findings), fingerprint(other));
    assert.notEqual(fingerprint(findings), fingerprint([]));
    assert.match(fingerprint(findings), /^[0-9a-f]{8}$/);
  });

  it("embeds the fingerprint marker used for issue dedupe", () => {
    const body = renderReport({
      findings: diffPhase("2次審査", "3次審査"),
      checkedAt: "2026-08-15T12:00:00.000Z",
      entryUrl: "https://2026.misscircle.jp/entry/734",
      fingerprintValue: "deadbeef",
    });
    assert.match(body, /<!-- mily-watch:fingerprint=deadbeef -->/);
    assert.match(body, /データの自動更新は行っていません/);
  });
});

describe("watcher never writes site data", () => {
  it("has no git or filesystem-write of source data in the runner", async () => {
    const source = await readFile(
      path.join(root, "scripts/watch-public-sources.mjs"),
      "utf8",
    );
    assert.doesNotMatch(source, /child_process|execSync|spawn/);
    assert.doesNotMatch(source, /git (commit|push)/);
    assert.doesNotMatch(source, /src\/data\/\w+\.ts["'],/);
    assert.match(source, /reuse|再利用|api\/mily-schedule\.js/);
  });

  it("keeps the workflow read-only for repository contents", async () => {
    const workflow = await readFile(
      path.join(root, ".github/workflows/watch-public-sources.yml"),
      "utf8",
    );
    assert.match(workflow, /contents: read/);
    assert.match(workflow, /issues: write/);
    assert.match(workflow, /workflow_dispatch/);
    assert.match(workflow, /schedule/);
    assert.match(workflow, /--body-file/);
    assert.doesNotMatch(workflow, /git push/);
  });
});
