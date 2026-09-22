import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { supportMv } from "../src/data/supportMv.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("みんなの太陽は確認済みYouTubeとMANABI LABを正本にする", () => {
  assert.equal(supportMv.title, "みんなの太陽");
  assert.equal(supportMv.youtubeUrl, "https://youtu.be/8Npuc_epHUU");
  assert.equal(
    supportMv.youtubeEmbedUrl,
    "https://www.youtube-nocookie.com/embed/8Npuc_epHUU",
  );
  assert.equal(supportMv.manabiLabUrl, "https://manabi-ai-lab.github.io/");
  assert.match(supportMv.subtitle, /非公式応援MV/);
  assert.match(supportMv.disclaimer, /公式MVではありません/);
});

test("HOMEで動画を埋め込み、相互導線を外部リンクとして出す", async () => {
  const [app, component] = await Promise.all([
    read("src/App.tsx"),
    read("src/components/SupportMusicVideo.tsx"),
  ]);

  assert.match(app, /<SupportMusicVideo \/>/);
  assert.ok(
    app.indexOf("<ChallengeConnection />") < app.indexOf("<SupportMusicVideo />"),
  );
  assert.ok(app.indexOf("<SupportMusicVideo />") < app.indexOf("<Latest"));
  assert.match(component, /supportMv\.youtubeEmbedUrl/);
  assert.match(component, /supportMv\.youtubeUrl/);
  assert.match(component, /supportMv\.manabiLabUrl/);
  assert.match(component, /allowFullScreen/);
  assert.match(component, /loading="lazy"/);
  assert.match(component, /<ExternalLink/);
});
