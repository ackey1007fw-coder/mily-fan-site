/**
 * 2026-08-26 夜の SHOWROOM ファンルーム音声メッセージ。
 * ガルアワイベ最終日のお礼。Latest / NEWS だけで再生する。
 * Gallery / media.ts / galleryVideos / Drive Gallery / /stories/ には出さない。
 *
 * SHOWROOM ファンルームページは iframe できない（X-Frame-Options: DENY）。
 * 個別 permalink もない。オーナーが当該投稿のサイト内再生を依頼したため、
 * 公開ルームプロフィール API の voice_list から取得した本人音声を自己ホストする。
 * SHOWROOM CDN は hotlink しない。
 */
export const girlAwardEventVoice = {
  id: "mily-b27-01-girl-award-event-voice",
  kind: "audio" as const,
  src: "/media/news/mily-b27-01-girl-award-event-voice.m4a",
  mimeType: "audio/mp4" as const,
  alt: "ガルアワイベ最終日の夜、みりぃがファンルームに残した音声メッセージ",
  label: "みりぃからの音声メッセージ · 22:36",
  provenance: "owner-requested" as const,
  sourceDate: "2026-08-26",
} as const;
