/**
 * 2026-09-04 朝のSHOWROOM。オーナー提供の収録から切り出した静止画。
 * チャット／視聴者名は写っていない顔出しカメラ。HOME Latest / /news/ と
 * LIVE STREAM（/activities/live/）専用。Gallery・media.ts・galleryVideos・/stories/ には出さない。
 * 再生permalinkはないため sourceUrl は null。
 * 公開用は metadata 除去済みの実フレームを SVG に収めたもの。crop・mask・scale なし（640×360のまま）。
 */

function still(id: string, alt: string, caption: string) {
  return {
    id,
    kind: "image" as const,
    src: `/media/news/${id}.svg`,
    width: 640,
    height: 360,
    alt,
    caption,
    published: true,
    provenance: "owner-provided" as const,
    sourceDate: "2026-09-04",
    sourceUrl: null,
  } as const;
}

export const cheekTiltImage = still(
  "mily-b51-01-morning-cheek-tilt",
  "みりぃが朝の配信で、両手を頬に当てて首をかしげている。ヘアピンをつけ、灰色のトップス。ノーメイク。",
  "2026年9月4日朝のSHOWROOM。頬に手。",
);

export const claspSmileImage = still(
  "mily-b51-02-morning-clasp-smile",
  "みりぃが朝の配信で、両手を胸の前で組んで笑っている。ヘアピンをつけ、灰色のトップス。ノーメイク。",
  "2026年9月4日朝のSHOWROOM。手を組んだ笑顔。",
);

export const suitBoardImage = still(
  "mily-b51-03-morning-suit-board",
  "みりぃがホワイトボードを持っている。ボードには「夜 スーツ配信」「22:30〜23:40」と書いてある。",
  "2026年9月4日朝のSHOWROOM。夜のスーツ配信ボード。",
);

export const suitBoardPoseImage = still(
  "mily-b51-04-morning-suit-board-pose",
  "みりぃがホワイトボードを持ち、頬にペンを当てている。ボードには「夜 スーツ配信」と「22:30〜23:40」が読める。",
  "2026年9月4日朝のSHOWROOM。夜のスーツ配信ボードとポーズ。",
);

export const morningShowroom20260904LeadImage = cheekTiltImage;

export const morningShowroom20260904AdditionalMedia = [
  claspSmileImage,
  suitBoardImage,
  suitBoardPoseImage,
] as const;
