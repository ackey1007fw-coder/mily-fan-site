/**
 * 2026-09-04 朝のSHOWROOM。オーナー提供の収録から切り出した静止画。
 * チャット／視聴者名は写っていない顔出しカメラ。LIVE STREAM（/activities/live/）専用。
 * Gallery・media.ts・galleryVideos・/stories/ には出さない。
 * 再生permalinkはないため sourceUrl は null。
 * 公開用は metadata 除去済みの実フレームを SVG に収めたもの（400×228）。
 * batch は受領順の b53。9/2 朝ラジオの b51 とは別素材。
 */

function still(id: string, alt: string, caption: string) {
  return {
    id,
    kind: "image" as const,
    src: `/media/live/${id}.svg`,
    width: 400,
    height: 228,
    alt,
    caption,
    published: true,
    provenance: "owner-provided" as const,
    sourceDate: "2026-09-04",
    sourceUrl: null,
  } as const;
}

export const cheekTiltImage = still(
  "mily-b53-01-cheek-tilt",
  "みりぃが朝の配信で、両手を頬に当てて首をかしげている。ヘアピンをつけ、灰色のトップス。ノーメイク。",
  "2026年9月4日朝のSHOWROOM。頬に手。",
);

export const claspSmileImage = still(
  "mily-b53-02-clasp-smile",
  "みりぃが朝の配信で、両手を胸の前で組んで笑っている。ヘアピンをつけ、灰色のトップス。ノーメイク。",
  "2026年9月4日朝のSHOWROOM。手を組んだ笑顔。",
);

export const closeSmileImage = still(
  "mily-b53-03-close-smile",
  "みりぃが朝の配信で、カメラに寄って笑っている。ヘアピンをつけ、灰色のトップス。ノーメイク。",
  "2026年9月4日朝のSHOWROOM。寄りの笑顔。",
);

export const suitBoardImage = still(
  "mily-b53-04-suit-board",
  "みりぃがホワイトボードを持っている。ボードには「夜 スーツ配信」「22:30〜23:40」と書いてある。",
  "2026年9月4日朝のSHOWROOM。夜のスーツ配信ボード。",
);

export const suitBoardPoseImage = still(
  "mily-b53-05-suit-board-pose",
  "みりぃがホワイトボードを持ち、頬にペンを当てている。ボードには「夜 スーツ配信」と「22:30〜23:40」が読める。",
  "2026年9月4日朝のSHOWROOM。夜のスーツ配信ボードとポーズ。",
);

export const morningShowroom20260904LeadImage = cheekTiltImage;

export const morningShowroom20260904AdditionalMedia = [
  claspSmileImage,
  closeSmileImage,
  suitBoardImage,
  suitBoardPoseImage,
] as const;
