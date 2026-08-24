/**
 * 2026-08-24 朝のSHOWROOMメイク配信画面。本人X投稿のビジュアル。
 * NEWS の代表画像（lead media）として Latest / /news/ / Portal Feed に出る。
 * NEWS が live-stream に関連付いているため、他のNEWS代表画像と同じく
 * /activities/live/ の「関連するメディア」にも自動で出る（selectActivityMedia）。
 * 公開用metadata除去以外はcrop・mask・scaleなしで元画像の見た目を維持。
 * Gallery・galleryVideos・/stories/・highlights には追加しない。
 */
export const morningMakeupShowroomImage = {
  id: "mily-b24-01-morning-makeup-showroom",
  kind: "image" as const,
  src: "/media/news/mily-b24-01-morning-makeup-showroom.jpg",
  width: 1500,
  height: 691,
  alt: "朝のSHOWROOMメイク配信で笑顔で手を振る三橋莉子さん",
  caption:
    "2026年8月24日朝のSHOWROOMメイク配信。花火大会仕様のフレームのなか、みりぃが笑顔で両手を振っている。",
  provenance: "owner-provided",
  sourceUrl: "https://x.com/mily_chan36/status/2091668215919444138",
  sourceDate: "2026-08-24",
} as const;
