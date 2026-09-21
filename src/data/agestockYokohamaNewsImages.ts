/**
 * 2026-09-21 本人X「AGESTOCK2026 in横アリ」投稿のオーナー提供写真2枚。
 * NEWSでのみ自己ホストし、SNS CDNへhotlinkしない。
 */
export const AGESTOCK_YOKOHAMA_X_URL =
  "https://x.com/Mily_chan36/status/2101944527695057190";

export const agestockYokohamaNewsImages = {
  group: {
    kind: "image" as const,
    src: "/media/news/mily-b138-01-agestock-yokohama-group.jpg",
    width: 1179,
    height: 884,
    alt: "横アリの客席で2人がピースをし、右側に白く伏せられた人物が写る写真",
  },
  twoShot: {
    kind: "image" as const,
    src: "/media/news/mily-b138-02-agestock-yokohama-two-shot.jpg",
    width: 1179,
    height: 884,
    alt: "横アリの客席で2人が並んでカメラを見る2ショット",
  },
} as const;
