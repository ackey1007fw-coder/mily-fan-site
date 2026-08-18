import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("home profile preview", () => {
  it("keeps the home concise and links to the detailed profile page", async () => {
    const source = await readFile(path.join(root, "src/components/About.tsx"), "utf8");
    const app = await readFile(path.join(root, "src/App.tsx"), "utf8");

    assert.match(source, /previewFactIds/);
    assert.doesNotMatch(source, /mbti/);
    assert.match(source, /fact\.label/);
    assert.match(source, /fact\.value/);
    assert.match(source, /fact\.asOf/);
    assert.match(source, /時点/);
    assert.doesNotMatch(source, /確認時点が分かる公開情報|まとめました|掲載しています/);
    assert.match(source, /href="\/profile\/"/);
    assert.match(source, /詳しいプロフィールを見る/);
    assert.doesNotMatch(source, /profile\.activities\.map/);
    assert.doesNotMatch(source, /profile\.collections\.map/);
    assert.ok(app.indexOf("<About />") < app.indexOf("<Gallery />"));
  });
});

describe("detailed profile provenance", () => {
  it("renders facts, activities, milestones, and the source registry", async () => {
    const source = await readFile(path.join(root, "src/ProfilePage.tsx"), "utf8");
    const footer = await readFile(path.join(root, "src/components/Footer.tsx"), "utf8");

    assert.match(source, /profile\.facts\.map\(\(fact\) =>/);
    assert.match(source, /fact\.sourceIds/);
    assert.match(source, /profile\.activities\.map\(\(activity\) =>/);
    assert.match(source, /activity\.sourceIds/);
    assert.match(source, /activity\.asOf/);
    assert.match(source, /profile\.collections\.map\(\(collection\) =>/);
    assert.match(source, /profile\.vision\.asOf/);
    assert.match(source, /collection\.asOf/);
    assert.match(source, /highlights\.map\(\(item\) =>/);
    assert.match(source, /href=\{item\.source\}/);
    assert.match(source, /Object\.values\(profileSources\)\.map/);
    assert.match(source, /ExternalLink/);
    assert.match(source, /ファン制作・非公式プロフィール/);
    assert.match(source, /<Footer \/>/);
    assert.match(footer, /公式・公認・本人運営ではありません/);
  });

  it("ships a standalone, indexable profile document", async () => {
    const html = await readFile(path.join(root, "profile/index.html"), "utf8");

    assert.match(html, /<title>三橋莉子（みりぃ \/ Mily）プロフィール｜非公式ファンサイト<\/title>/);
    assert.match(html, /__PROFILE_CANONICAL__/);
    assert.match(html, /"@type": "ProfilePage"/);
    assert.match(html, /"@type": "BreadcrumbList"/);
    assert.match(html, /"name": "三橋莉子"/);
    assert.doesNotMatch(html, /"birthDate"/);
    assert.match(html, /src="\/src\/profile-main\.tsx"/);
  });
});
