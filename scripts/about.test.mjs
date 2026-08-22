import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { profile } from "../src/data/profile.ts";

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

  it("derives the MISS CIRCLE current phase from the contest source of truth", async () => {
    const activity = profile.activities.find(({ id }) => id === "miss-circle");
    const source = await readFile(path.join(root, "src/ProfilePage.tsx"), "utf8");

    assert.ok(activity);
    assert.equal(
      activity.body,
      "MISS CIRCLE CONTEST 2026に三橋莉子としてENTRY 734で出場。",
    );
    assert.deepEqual(activity.points, ["ENTRY 734"]);
    assert.deepEqual(activity.sourceIds, ["missCircle"]);
    assert.equal(activity.status, "confirmed");
    assert.equal(activity.asOf, undefined);
    assert.doesNotMatch(
      [activity.body, ...activity.points].join("\n"),
      /[一二三四五六七八九十\d]+次審査|進出|通過|現在/,
    );

    assert.match(source, /import \{ contest \} from "\.\/data\/contest"/);
    assert.match(source, /activity\.id === "miss-circle" && contest\.currentPhase/);
    assert.match(source, /contest\.currentPhase\.name/);
    assert.match(source, /contest\.lastVerifiedAt/);
    assert.match(source, /contest\.currentPhase\.source/);
    assert.match(source, /href=\{contest\.entryUrl\}/);
    assert.doesNotMatch(source, /const ENTRY_URL/);
    assert.doesNotMatch(source, /"3次審査進出"/);
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
