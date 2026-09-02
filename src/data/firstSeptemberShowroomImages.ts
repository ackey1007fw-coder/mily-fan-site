/**
 * 2026-09-01 9月はじめてのSHOWROOM。オーナー提供の配信画面
 * （視聴者コメント画面ではない）。
 * 6枚は `/news/` の同じNEWSカード。Gallery・media.ts・galleryVideos・/stories/ には出さない。
 * HOME Latest は先頭3件だけなので、9/2が3件ある間はこのカードはHOMEに出ない。
 * 代表（カードの顔）はあっきーさんボード。やすぴさんボードは additionalMedia の末尾のみ。
 * NEWS が activityIds: live-stream を持つため、代表1枚だけが
 * selectActivityMedia() 経由で /activities/live/ の関連メディアに出る（標準動作）。
 * 公開用metadata除去以外はcrop・mask・scaleなし。収録の実寸 640×360 のまま。
 * 再生permalinkはないため sourceUrl は null。
 */
const ACKEY_BOARD =
  "みりぃがホワイトボードを持っている。ボードには「トマトの栄養素 ♡」「1人目」「あっきーさん！！」と書いてある";

function ackeyStill(
  id: string,
  alt: string,
  caption: string,
) {
  return {
    id,
    kind: "image" as const,
    src: `/media/news/${id}.jpg`,
    width: 640,
    height: 360,
    alt,
    caption,
    published: true,
    provenance: "owner-provided" as const,
    sourceDate: "2026-09-01",
    sourceUrl: null,
  } as const;
}

/** 22:46:33 ボード寄り。Latest / NEWS の代表。 */
export const firstSeptemberTomatoBoardImage = ackeyStill(
  "mily-b48-01-tomato-nutrient-ackey",
  ACKEY_BOARD,
  "2026年9月1日のSHOWROOM。あっきーさんボード。ボード寄り。",
);

/** 22:46:39 指差し。additionalMedia の先頭。 */
export const firstSeptemberAckeyPointImage = ackeyStill(
  "mily-b48-02-ackey-point",
  "みりぃがホワイトボードを持ち、指で「あっきーさん！！」を指している。ボードには「トマトの栄養素 ♡」「1人目」「あっきーさん！！」と書いてある",
  "2026年9月1日のSHOWROOM。あっきーさんボード。指差し。",
);

/** 22:46:41 ポーズ直前。 */
export const firstSeptemberAckeyPreposeImage = ackeyStill(
  "mily-b48-03-ackey-prepose",
  "みりぃがホワイトボードを持ち、手のひらでボードを示している。ボードには「トマトの栄養素 ♡」「1人目」「あっきーさん！！」と書いてある",
  "2026年9月1日のSHOWROOM。あっきーさんボード。ポーズ直前。",
);

/** 22:46:43 頬。 */
export const firstSeptemberAckeyCheekImage = ackeyStill(
  "mily-b48-04-ackey-cheek",
  ACKEY_BOARD,
  "2026年9月1日のSHOWROOM。あっきーさんボード。",
);

/** 22:46:51 頭を指さす。 */
export const firstSeptemberAckeyHeadpointImage = ackeyStill(
  "mily-b48-05-ackey-headpoint",
  "みりぃがホワイトボードを持ち、頭を指さしている。ボードには「トマトの栄養素 ♡」「1人目」「あっきーさん！！」と書いてある",
  "2026年9月1日のSHOWROOM。あっきーさんボード。頭を指さす。",
);

export const firstSeptemberFanmarkBoardImage = {
  id: "mily-b48-06-fanmark-yasupi",
  kind: "image" as const,
  src: "/media/news/mily-b48-06-fanmark-yasupi.jpg",
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

/** あっきーさん4枚のあと、やすぴさんボードを末尾に置く。 */
export const firstSeptemberShowroomAdditionalMedia = [
  firstSeptemberAckeyPointImage,
  firstSeptemberAckeyPreposeImage,
  firstSeptemberAckeyCheekImage,
  firstSeptemberAckeyHeadpointImage,
  firstSeptemberFanmarkBoardImage,
] as const;
