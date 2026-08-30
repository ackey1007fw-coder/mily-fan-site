import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  claimsApprovalStatus,
  collectFiles,
  decodePublicText,
  isPublicSurface,
  publicTextSegments,
  SCAN_EXTENSIONS,
} from "./check-site-identity.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

function relativeLuminance(hex) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(value.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe("mily site identity", () => {
  it("uses the mily public identity in package and repo metadata", async () => {
    const pkg = JSON.parse(await read("package.json"));
    const site = await read("src/data/site.ts");
    const agents = await read("AGENTS.md");

    assert.equal(pkg.name, "mily-fan-site");
    assert.match(site, /mily-fan-site/);
    assert.match(site, /https:\/\/mily-fan-site\.vercel\.app/);
    assert.doesNotMatch(pkg.name, /\bmilly\b/i);
    assert.doesNotMatch(site, /\bmilly\b/i);
    assert.match(agents, /mily-fan-site/);
    assert.match(agents, /@mily_chan36/);
    assert.doesNotMatch(agents, /\bmilly\b/i);
  });

  it("keeps the unofficial disclaimer in the document title", async () => {
    const html = await read("index.html");
    assert.match(html, /<title>みりぃ ファンサイト（非公式）<\/title>/);
    assert.match(html, /ファン運営の非公式サイト/);
    assert.match(html, /本人運営ではありません/);
    assert.doesNotMatch(html, /公認ではありません/);
  });

  it("keeps standalone / home-screen names unofficial", async () => {
    const manifest = JSON.parse(await read("public/site.webmanifest"));
    assert.match(manifest.name, /非公式|ファンサイト/);
    assert.match(manifest.short_name, /非公式|ファンサイト/);
    assert.doesNotMatch(manifest.short_name, /^みりぃ$/);
    assert.match(manifest.description, /非公式/);
    assert.match(manifest.description, /ファン運営/);
    assert.match(manifest.description, /本人運営ではありません/);
    assert.doesNotMatch(manifest.description, /公認ではありません/);
    assert.equal(manifest.display, "standalone");
  });

  it("stores favicon.svg as valid UTF-8 XML", async () => {
    const bytes = await readFile(path.join(root, "public/favicon.svg"));
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    assert.match(text, /encoding="UTF-8"/);
    assert.match(text, /aria-label="みりぃ ファンサイト（非公式）"/);
    assert.doesNotMatch(text, /\uFFFD/);
  });

  it("uses a WCAG AA contrast color for schedule kind labels", async () => {
    const ratio = contrastRatio("#8a4e20", "#fffcf8");
    assert.ok(ratio >= 4.5, `contrast ratio ${ratio.toFixed(2)} is below 4.5`);
    const css = await read("src/components/Schedule.tsx");
    assert.match(css, /text-apricot-ink/);
    assert.doesNotMatch(css, /text-apricot[^-]/);
  });

  it("passes the site identity guard", () => {
    const result = spawnSync(
      process.execPath,
      [path.join(root, "scripts/check-site-identity.mjs"), "main"],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr || result.stdout);
  });

  it("scans public metadata files in the identity guard", async () => {
    for (const extension of [".webmanifest", ".xml", ".txt", ".svg"]) {
      assert.equal(SCAN_EXTENSIONS.has(extension), true, `should scan ${extension}`);
    }

    const files = await collectFiles(root);
    const rel = files.map((filePath) =>
      path.relative(root, filePath).replaceAll("\\", "/"),
    );

    for (const expected of [
      "public/site.webmanifest",
      "public/sitemap.xml",
      "public/robots.txt",
      "public/favicon.svg",
    ]) {
      assert.ok(rel.includes(expected), `should scan ${expected}`);
    }
  });

  it("rejects affirmative and negative approval claims across public surfaces", () => {
    for (const relative of [
      "index.html",
      "public/site.webmanifest",
      "src/components/Footer.tsx",
      "support/index.html",
      "README.md",
    ]) {
      assert.equal(isPublicSurface(relative), true, `should guard ${relative}`);
    }

    for (const claim of [
      "当サイトは本人公認です",
      "このファンサイトは公認されています",
      "本ページは公認ではありません",
      "このサイトは非公認です",
      "本人の公認を受けたファンサイトです",
      "みりぃファンサイトは本人から公認を受けています",
      "当サイトは公認を受けました",
      "当サイトは公認をいただきました",
      "当サイトは公認されました",
      "当サイトは公認されていません",
      "当サイトは\n公認です",
      "当サイトは公認を受けていません",
      "当サイトは公認をいただいていません",
      "当サイトは公認サイトです",
      "当サイトは公認サイトではありません",
      "公認されたファンサイトです",
      "本人に公認されたファンサイトです",
      "公認のファンサイトです",
      "三橋莉子さん公認のファンサイトです",
      "本人公認ファンサイトです",
      "みりぃ公認ファンサイトです",
      "当サイトは公認でございます",
      "当サイトは公認ではございません",
      "「当サイト」は公認です",
      "『みりぃ ファンサイト』は本人公認です",
      "当サイトは公認じゃありません",
      "当サイトは公認でないです",
      "This fan site is approved by Mily",
      "This is an unapproved fan site",
    ]) {
      assert.equal(claimsApprovalStatus(claim), true, `should reject: ${claim}`);
    }

    assert.equal(
      claimsApprovalStatus("ファン運営の非公式サイトです。本人運営ではありません。"),
      false,
    );

    for (const unrelated of [
      "公認会計士",
      "公認アンバサダーを務めています",
      "公認の有無は公開表記で扱いません",
      "このルールは公認という単語自体を禁止しません",
      "このイベントは大学公認です",
      "この団体は非公認です",
      "このサイトを応援！このイベントは大学公認です",
      "大学公認サイトを紹介します",
      "このイベントの公認サイトです",
      "このファンサイトでは、このイベントは大学公認です",
      "大学公認ファンサイトを紹介します",
      "このイベントの公認ファンサイトへ移動します",
    ]) {
      assert.equal(
        claimsApprovalStatus(unrelated),
        false,
        `should allow unrelated wording: ${unrelated}`,
      );
    }

    const separateLiterals =
      'const intro = "このサイトを応援"; const event = "このイベントは大学公認です";';
    assert.equal(
      publicTextSegments(separateLiterals, "src/example.ts").some(
        claimsApprovalStatus,
      ),
      false,
    );

    assert.equal(
      publicTextSegments(
        'const description = "当サイトは" + "公認です";',
        "src/example.ts",
      ).some(claimsApprovalStatus),
      true,
      "should combine concatenated public strings",
    );

    const renderedNewline = "<p>当サイトは\n公認です</p>";
    assert.equal(
      publicTextSegments(renderedNewline, "src/example.tsx").some(
        claimsApprovalStatus,
      ),
      true,
    );

    for (const renderedClaim of [
      "<p>当サイトは<strong>公認</strong>です</p>",
      '<p>当サイトは{"公認"}です</p>',
      "<p>{site.displayTitle}は<strong>公認</strong>です</p>",
      "<div>当サイトは<strong>公認</strong>です</div>",
      "<>当サイトは<strong>公認</strong>です</>",
      "<span><span>当サイトは</span><strong>公認</strong>です</span>",
    ]) {
      assert.equal(
        publicTextSegments(renderedClaim, "src/example.tsx").some(
          claimsApprovalStatus,
        ),
        true,
        `should combine rendered markup: ${renderedClaim}`,
      );
    }

    assert.equal(
      publicTextSegments(
        "`${site.displayTitle}は公認です`",
        "src/example.ts",
      ).some(claimsApprovalStatus),
      true,
      "should resolve the site title in template-literal metadata",
    );

    const markdownWithQuote = '当サイトは公認です。\n\n"note"';
    assert.equal(
      publicTextSegments(markdownWithQuote, "public/about.md").some(
        claimsApprovalStatus,
      ),
      true,
    );

    for (const escapedClaim of [
      '"当サイトは\\u516c\\u8a8dです"',
      "<p>当サイトは&#x516c;&#x8a8d;です</p>",
      "<p>当サイトは&#20844;&#35469;です</p>",
    ]) {
      assert.equal(
        publicTextSegments(escapedClaim, "public/example.html").some(
          claimsApprovalStatus,
        ),
        true,
        `should decode rendered public text: ${escapedClaim}`,
      );
    }

    assert.equal(decodePublicText("\\u516c\\u8a8d"), "公認");

    for (const yamlClaim of [
      "description: 当サイトは公認です",
      "- 当サイトは公認ではありません",
      "description: |\n  当サイトは公認です",
      "description: >\n  当サイトは\n  公認です",
      "description: |2\n  当サイトは公認です",
      "description: >2-\n  当サイトは\n  公認です",
    ]) {
      assert.equal(
        publicTextSegments(yamlClaim, "public/site.yaml").some(
          claimsApprovalStatus,
        ),
        true,
        `should scan unquoted YAML: ${yamlClaim}`,
      );
    }

    for (const formattedClaim of [
      "当サイトは**公認**です",
      "当サイトは[公認](https://example.test/)です",
    ]) {
      assert.equal(
        publicTextSegments(formattedClaim, "README.md").some(
          claimsApprovalStatus,
        ),
        true,
        `should normalize rendered Markdown: ${formattedClaim}`,
      );
    }

    assert.equal(
      publicTextSegments(
        "<description><![CDATA[当サイトは公認です]]></description>",
        "public/example.xml",
      ).some(claimsApprovalStatus),
      true,
      "should preserve XML CDATA as visible text",
    );

    assert.equal(
      publicTextSegments(
        '// Avoid "当サイトは公認です"\nconst safe = "ファン運営です";',
        "src/example.ts",
      ).some(claimsApprovalStatus),
      false,
      "should ignore quoted examples in source comments",
    );

    for (const attributeClaim of [
      "<meta content=当サイトは公認です>",
      "<div aria-label=当サイトは公認です></div>",
    ]) {
      assert.equal(
        publicTextSegments(attributeClaim, "public/example.html").some(
          claimsApprovalStatus,
        ),
        true,
        `should scan unquoted HTML attributes: ${attributeClaim}`,
      );
    }
  });
});
