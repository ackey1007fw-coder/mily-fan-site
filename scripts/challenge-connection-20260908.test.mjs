import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { amiMilyKoreaPromise } from "../src/data/challengeConnection.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("天宮あみさんとの約束導線は確認済み公開ソースだけを使う", () => {
  assert.equal(amiMilyKoreaPromise.date, "2026-09-08");
  assert.equal(
    amiMilyKoreaPromise.source.url,
    "https://x.com/amis2_mh/status/2097322336387297549",
  );
  assert.equal(
    amiMilyKoreaPromise.milyReply.url,
    "https://x.com/Mily_chan36/status/2097324863921041811",
  );
  assert.equal(amiMilyKoreaPromise.amiEntry.url, "https://2026.frecam.jp/entry/837");
  assert.equal(amiMilyKoreaPromise.amiX.url, "https://x.com/amis2_mh");
  assert.equal(amiMilyKoreaPromise.amiTikTok.url, "https://www.tiktok.com/@amis2_m.h");
  assert.equal(amiMilyKoreaPromise.amiTikTok.label, "天宮あみさんのTikTok");
  assert.doesNotMatch(amiMilyKoreaPromise.body, /妹分/);
});

test("HOMEカードは天宮あみさんのTikTokプロフィールへ導く", async () => {
  const source = await readFile(
    path.join(root, "src/components/ChallengeConnection.tsx"),
    "utf8",
  );
  assert.match(source, /item\.amiTikTok\.url/);
  assert.match(source, /item\.amiTikTok\.label/);
  assert.equal(source.includes("妹分"), false);
});

test("AI生成表示のある投稿画像をサイト素材として保持しない", () => {
  assert.equal("image" in amiMilyKoreaPromise, false);
});
