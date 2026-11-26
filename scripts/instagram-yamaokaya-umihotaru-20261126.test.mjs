import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { media } from "../src/data/media.ts";
import { news, newsDisplayMedia } from "../src/data/news.ts";
import { yamaokayaPhotos } from "../src/data/yamaokayaPhotos.ts";
import {
  yamaokayaNightDriveVideo,
  yamaokayaNightWalkVideo,
  yamaokayaUmihotaruDashVideo,
} from "../src/data/yamaokayaVideos.ts";

test("yamaokaya NEWS shares the confirmed details", () => {
  const item = news.find(({ id }) => id === "2026-11-26-instagram-yamaokaya-umihotaru");
  assert.ok(item);
  assert.equal(news[0], item);
  assert.equal(item.date, "2026-11-26");
  assert.equal(item.title, "大好きな友達と山岡家へ🍜 寒い日のラーメンと海ほたる");
  assert.equal(item.source, "https://www.instagram.com/p/DgM7i3xE_Bv/");
  assert.equal(item.sourceLabel, "みりぃ本人のInstagram投稿を見る（11月26日）");
  assert.match(item.body, /山岡家/);
  assert.match(item.body, /海ほたる/);
  const shown = newsDisplayMedia(item);
  assert.equal(shown.length, 9);
  assert.deepEqual(
    shown.map((m) => m.kind),
    ["image", "image", "image", "image", "image", "video", "video", "video", "image"],
  );
  assert.equal(shown[5], yamaokayaUmihotaruDashVideo);
  assert.equal(shown[6], yamaokayaNightWalkVideo);
  assert.equal(shown[7], yamaokayaNightDriveVideo);
});

test("yamaokaya videos keep the confirmed manifests", () => {
  assert.deepEqual(yamaokayaUmihotaruDashVideo, {
    id: "mily-b282-06-umihotaru-dash", kind: "video",
    alt: "強風の海ほたるを、猛ダッシュで駆け抜ける2人の後ろ姿（音声なし）",
    src: "/media/gallery/mily-b282-06-umihotaru-dash.mp4",
    poster: "/media/gallery/mily-b282-06-umihotaru-dash-poster.jpg",
    width: 476, height: 358, provenance: "owner-provided",
    sourceLabel: "Instagram 投稿", sourceDate: "2026-11-26", published: true,
  });
  assert.deepEqual(yamaokayaNightWalkVideo, {
    id: "mily-b282-07-night-walk", kind: "video",
    alt: "夜の海ほたるを歩く、2人の後ろ姿（音声なし）",
    src: "/media/gallery/mily-b282-07-night-walk.mp4",
    poster: "/media/gallery/mily-b282-07-night-walk-poster.jpg",
    width: 476, height: 358, provenance: "owner-provided",
    sourceLabel: "Instagram 投稿", sourceDate: "2026-11-26", published: true,
  });
  assert.deepEqual(yamaokayaNightDriveVideo, {
    id: "mily-b282-08-night-drive", kind: "video",
    alt: "真っ暗な車の中で、1人運転するみりぃ（音声なし）",
    src: "/media/gallery/mily-b282-08-night-drive.mp4",
    poster: "/media/gallery/mily-b282-08-night-drive-poster.jpg",
    width: 720, height: 540, provenance: "owner-provided",
    sourceLabel: "Instagram 投稿", sourceDate: "2026-11-26", published: true,
  });
});

test("yamaokaya photos are published in the Gallery with the post as source", () => {
  assert.deepEqual(
    yamaokayaPhotos.map(({ id }) => id),
    ["mily-b282-01", "mily-b282-02", "mily-b282-03", "mily-b282-04", "mily-b282-05", "mily-b282-09"],
  );
  for (const photo of yamaokayaPhotos) {
    assert.equal(photo.published, true);
    assert.equal(photo.sourceUrl, "https://www.instagram.com/p/DgM7i3xE_Bv/");
    assert.equal(photo.sourceDate, "2026-11-26");
    assert.equal(photo.credit, null);
    assert.ok(media.includes(photo));
  }
});

test("public media matches the provided files", async () => {
  for (const [src, bytes, hash] of [
    ["/media/gallery/mily-b282-01-ramen-chopsticks-1600.jpg", 138076, "4c7a696ab78117390c7290475bea28052383252bb1cfdf6d1eed0c81a6a7327d"],
    ["/media/gallery/mily-b282-01-ramen-chopsticks-1600.webp", 69080, "bf87f87eae64b2706fc963a0cfe8bea653df13a63f1b573c6ca58f32913df5a6"],
    ["/media/gallery/mily-b282-01-ramen-chopsticks-480.jpg", 22844, "7e59daa1417e3b56e3289bddad51882c3e1582d96eaa59cb89f692df795d644e"],
    ["/media/gallery/mily-b282-01-ramen-chopsticks-480.webp", 15458, "a4e7fb66bb19dc8a7f8f91cf510cf16ab50efb82162e0b023af1b939f0bf90d8"],
    ["/media/gallery/mily-b282-01-ramen-chopsticks-960.jpg", 65179, "70beb4c04340c489ed0b99ab15db3faf55e150677b88d52c4b26312546563c10"],
    ["/media/gallery/mily-b282-01-ramen-chopsticks-960.webp", 38120, "2b1b2d4ad5e88ef9e5eeb3a703843d6e346870c35273d0ebfc33bdef96bdb96d"],
    ["/media/gallery/mily-b282-02-ramen-side-glance-1600.jpg", 132695, "1f10685d3aa90892e2fb7a17021ed2d439ca124d52edc63e6e90fb89793ac4a1"],
    ["/media/gallery/mily-b282-02-ramen-side-glance-1600.webp", 64942, "aba1cd398c60e92ecc62fac781b012524ff74dd0e70832ed13580f1dca9b491c"],
    ["/media/gallery/mily-b282-02-ramen-side-glance-480.jpg", 23635, "28dd89201aaf092e9e3f947bbe700c94c98ec1338587e5d12ae088f40d3e8419"],
    ["/media/gallery/mily-b282-02-ramen-side-glance-480.webp", 15934, "0179cf188318db3a26729fcaef7e7a53c44447e4b5d8369171cf9767de94cacb"],
    ["/media/gallery/mily-b282-02-ramen-side-glance-960.jpg", 64741, "8e2b72e0875ff20adf4a9fd239d1c530efb779ae33d1b79efb2da6e185f9622f"],
    ["/media/gallery/mily-b282-02-ramen-side-glance-960.webp", 36918, "f93e4009da3c3998ffd40ab00a6bed9d01ba0da3f1363ad858712150153bf7e6"],
    ["/media/gallery/mily-b282-03-gyoza-plate-1600.jpg", 133675, "8122de42d857a70c0281c9066ac75ff33cf9a82ccfd4b6f62ec0ec4d53403e5b"],
    ["/media/gallery/mily-b282-03-gyoza-plate-1600.webp", 67502, "16fcb92f7a48ceb45863bdec2f182f689c6a8409e4768ec83e1469ad453282c9"],
    ["/media/gallery/mily-b282-03-gyoza-plate-480.jpg", 24759, "808f8de079f8b779cc3e7ec9779e35cd1e5330afd21f3877017cedcfc5f7f427"],
    ["/media/gallery/mily-b282-03-gyoza-plate-480.webp", 16704, "229771ebee868c281dda9c86519336c3109c376951428929da9c15a8ae15641a"],
    ["/media/gallery/mily-b282-03-gyoza-plate-960.jpg", 66224, "e5caa8b44088d354b1680f02a3029418a2c654d680c79c1b3d318506c19e6992"],
    ["/media/gallery/mily-b282-03-gyoza-plate-960.webp", 38786, "33085cdcc6eea3462285a1c96bde6ccd00f612492a7a1d6a44b7be1bae8ba651"],
    ["/media/gallery/mily-b282-04-gyoza-lookdown-1600.jpg", 136884, "17daab08abee2def018d188fc43902a41d1c892089a83474b121ac82aa672e3e"],
    ["/media/gallery/mily-b282-04-gyoza-lookdown-1600.webp", 72242, "a69f7b3d71d021c91f13b05f5d02206899cab9f19fcea1c005cb481a44986867"],
    ["/media/gallery/mily-b282-04-gyoza-lookdown-480.jpg", 24601, "a55f9f5efda05bb66a3395681985f4fd0c99231fe6733dc81b12b6df160f822f"],
    ["/media/gallery/mily-b282-04-gyoza-lookdown-480.webp", 16866, "a2ceec61788db8820522e6e9d368b94927c865177b900dfa5cb6d9d7ceceab78"],
    ["/media/gallery/mily-b282-04-gyoza-lookdown-960.jpg", 66613, "40bd91509d4f8be5d50a35f9c8a3b1136ceaabd1a338164c493597d299d74f60"],
    ["/media/gallery/mily-b282-04-gyoza-lookdown-960.webp", 39162, "27464670bcac14146a521f4c1d660245b131083f7e68c81f66612c3d0ad93b3c"],
    ["/media/gallery/mily-b282-05-ramen-three-bowls-1600.jpg", 111454, "79cf426492bcd03bd86824898e8d4b92de259e4fb920ead466cea6bac26294af"],
    ["/media/gallery/mily-b282-05-ramen-three-bowls-1600.webp", 65934, "a2042f2a4d80b076d8b5ff8bb780522d493f6aaf8a05dca1f4e0fa716affa058"],
    ["/media/gallery/mily-b282-05-ramen-three-bowls-480.jpg", 32832, "82359dac06737ab78d3cb1b670821ba73719b47ace44eafe09978be40572425e"],
    ["/media/gallery/mily-b282-05-ramen-three-bowls-480.webp", 24796, "543aaa742e580f75afa6c1de215226fc0bf5bcff2aa7a3a2e132601bad1bd396"],
    ["/media/gallery/mily-b282-05-ramen-three-bowls-960.jpg", 86759, "36b104cfff84221ad5a8ea37dde243d1efb351cac5230941b86fda49fccd8050"],
    ["/media/gallery/mily-b282-05-ramen-three-bowls-960.webp", 54116, "faea7336dc256ca24852e86a8f205a58941910a6268378aaf8928a9b09900657"],
    ["/media/gallery/mily-b282-06-umihotaru-dash-poster.jpg", 12562, "bccd0defcb3f373ea393c81292e07ab60a2d0dc3ee81e95ff344c87ac91983fd"],
    ["/media/gallery/mily-b282-06-umihotaru-dash.mp4", 185671, "a48f9adf8d9232ffd13830755a826db59a2b6caa171a6b0a7235b43a571d7e75"],
    ["/media/gallery/mily-b282-07-night-walk-poster.jpg", 7660, "a03d74ce4ffa50d35d2a58d2f71723a29c32e7b4d9221ef22aecc89fca68d11e"],
    ["/media/gallery/mily-b282-07-night-walk.mp4", 85289, "63d549f4d4bc5e21501905d1c6817e6e2c3d2ad284ee7ace352c79aa2d6c4777"],
    ["/media/gallery/mily-b282-08-night-drive-poster.jpg", 9172, "11acfbb1574bcae2d13c8068e4923ea500b1b784de7c4700a8deffcffe86a0e3"],
    ["/media/gallery/mily-b282-08-night-drive.mp4", 127850, "d3cf91370c090353bc1ee9489a96fd581e3ab2778f2732a38820f555694b57a4"],
    ["/media/gallery/mily-b282-09-yamaokaya-sign-1600.jpg", 25053, "955c050afb32a451d3cfa412ca0113d061497583da3bdd167833ac641c96c010"],
    ["/media/gallery/mily-b282-09-yamaokaya-sign-1600.webp", 11054, "16e996fccbed7d3ff7d573a0a3a88aade6ba0c7da3c477f281e8e544b378b625"],
    ["/media/gallery/mily-b282-09-yamaokaya-sign-480.jpg", 7588, "42fb41d98f2f341218b6fb81bc8802aba9eaf5f50c01f96d4b0827daac0ecb2f"],
    ["/media/gallery/mily-b282-09-yamaokaya-sign-480.webp", 4440, "83a5ab36589abdc7edf122d20a3541506e89b38a3c5fa326982b757d813db7d5"],
    ["/media/gallery/mily-b282-09-yamaokaya-sign-960.jpg", 18293, "b0157a4d66ba0877d6576dabf6be26bddb4671ec201bef5837394252f54f180f"],
    ["/media/gallery/mily-b282-09-yamaokaya-sign-960.webp", 9250, "cf768e5cf39f36cda198a025cb8dc3ca8d49f4ee48eafe846c6976f23b746a59"],
  ]) {
    const data = await readFile(new URL(`../public${src}`, import.meta.url));
    assert.equal(data.length, bytes, src);
    assert.equal(createHash("sha256").update(data).digest("hex"), hash, src);
  }
});
