/** Owner-requested public Fan Room voice. Reuse the Latest / NEWS audio player. */
export const incomingCallFanroomVoice = {
  id: "mily-b122-01-fanroom-incoming-call-voice",
  kind: "audio" as const,
  src: "/media/news/mily-b122-01-fanroom-incoming-call-voice.m4a",
  mimeType: "audio/mp4" as const,
  alt: "9月15日20:27、みりぃがファンルームに投稿した音声メッセージ",
  label: "みりぃからの着信 · 20:27 · 約6秒",
  provenance: "owner-requested" as const,
  sourceDate: "2026-09-15",
  sourcePublishedAt: "2026-09-15T20:27+09:00",
} as const;
