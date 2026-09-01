/**
 * 2026-09-01 9月はじめてのSHOWROOM。オーナー提供の配信画面2枚
 * （視聴者コメント画面ではない）。HOME Latest / /news/ 専用。
 * Gallery・media.ts・galleryVideos・/stories/ には出さない。
 * 代表（カードの顔）はあっきーさんボード。やすぴさんボードは additionalMedia のみ。
 * 公開用metadata除去以外はcrop・mask・scaleなし。収録の実寸 640×360 のまま。
 * 再生permalinkはないため sourceUrl は null。
 */
const LEAD_BASE = "/media/news/mily-b48-01-tomato-nutrient-ackey";
const EXTRA_BASE = "/media/news/mily-b48-02-fanmark-yasupi";

export const firstSeptemberTomatoBoardImage = {
  id: "mily-b48-01-tomato-nutrient-ackey",
  kind: "image" as const,
  src: `${LEAD_BASE}.jpg`,
  width: 640,
  height: 360,
  alt: "みりぃがホワイトボードを持っている。ボードには「トマトの栄養素 ♡」「1人目」「あっきーさん！！」と書いてある",
  caption:
    "2026年9月1日のSHOWROOM。ボード1枚目。「トマトの栄養素 ♡」「1人目」「あっきーさん！！」",
  published: true,
  provenance: "owner-provided" as const,
  sourceDate: "2026-09-01",
  sourceUrl: null,
} as const;

export const firstSeptemberFanmarkBoardImage = {
  id: "mily-b48-02-fanmark-yasupi",
  kind: "image" as const,
  src: `${EXTRA_BASE}.jpg`,
  width: 640,
  height: 360,
  alt: "みりぃがホワイトボードを持っている。ボードには「ファンマーク」とトマトの絵、「2人目」「やすぴ。さん♪」と書いてある",
  caption:
    "2026年9月1日のSHOWROOM。ボード2枚目。「ファンマーク」とトマトの絵、「2人目」「やすぴ。さん♪」",
  published: true,
  provenance: "owner-provided" as const,
  sourceDate: "2026-09-01",
  sourceUrl: null,
} as const;
