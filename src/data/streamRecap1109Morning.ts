import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["01:00", "wave-greeting", "手を振って挨拶する場面"],
  ["02:30", "tilt-smile", "首をかしげた笑顔"],
  ["05:00", "chin-pose", "あごに手を添えたポーズ"],
  ["17:30", "soft-smile", "やわらかな笑顔"],
  ["18:30", "cheek-pose", "頬に手を添えた表情"],
  ["20:00", "hood-talk", "フードをかぶって話す場面"],
  ["34:00", "talk-smile", "笑顔のトーク場面"],
  ["34:30", "hands-up", "両手を上げて話す場面"],
  ["35:45", "paws-pose", "両手を頬のそばに上げたポーズ"],
  ["36:00", "cheek-smile", "頬に手を添えた笑顔"],
] as const;

export const morning20261109Gallery: StreamRecapImage[] = moments.map(([time, slug, label], i) => {
  const filename = `mily-b258-${String(i + 1).padStart(2, "0")}-20261109-morning-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt: `みりぃの${label}`, caption: `0:${time}｜${label}`, downloadName: filename };
});

export const streamRecap1109Morning: StreamRecap = {
  id: "2026-11-09-morning-showroom",
  date: "2026-11-09",
  dateLabel: "2026.11.09（月）",
  theme: "朝の結果待ちとこれから",
  broadcastLabel: "録画開始6:00頃〜 約36分",
  platformLabel: "SHOWROOM",
  summary: "11月9日朝は、セミファイナルの結果発表を待つ気持ちを語り合う雑談枠でした。昨夜の配信100日記念を振り返り、きっかけ配信への思いや、この後の大学と友達との予定を話しました。",
  image: morning20261109Gallery[9],
  gallery: morning20261109Gallery,
  galleryZip: {
    src: "/media/live/mily-b258-20261109-morning-photos.zip",
    filename: "mily-20261109-morning-photos.zip",
    label: "この回のスクショ10枚をまとめて保存",
  },
  highlights: [
    { timestamp: "0:03:03", title: "昨夜の配信を振り返って", body: "100日記念だった前夜の配信が、いつもの自分らしくなかったかもしれないと振り返り、見た人が驚かなかったか気にかけていました。" },
    { timestamp: "0:08:06", title: "この後は友達と大学へ", body: "日付を確認し直し、この後は久しぶりに友達に会いに行くことや、大学へ行く予定を話しました。" },
    { timestamp: "0:13:00", title: "結果発表を待つ時間", body: "もうすぐ発表があると思うと落ち着かず、発表までの間にきっかけ配信もやりたいと話しました。" },
    { timestamp: "0:19:14", title: "きっかけ配信の話", body: "きっかけ配信の効率や、最近は取り組む人が増えているという話題になりました。" },
    {
      timestamp: "0:21:36", title: "寝ても配信の夢を見る", body: "寝ても配信の夢を見て、今朝も応援してくれる人たちが夢に出てきたと話しました。",
      clip: { src: "/media/live-clips/mily-b258-11-20261109-morning-dream-talk.mp4", poster: "/media/live-clips/mily-b258-11-20261109-morning-dream-talk-poster.jpg", width: 640, height: 360, durationSeconds: 12, sourceTimestamp: "0:21:36" },
    },
    {
      timestamp: "0:22:06", title: "ファイナルへ向けた気持ち", body: "セミファイナルで盛り上げてもらった分、新しい人に見つけてもらえる今のうちに動きたいと話しました。",
      clip: { src: "/media/live-clips/mily-b258-12-20261109-morning-final-hopes.mp4", poster: "/media/live-clips/mily-b258-12-20261109-morning-final-hopes-poster.jpg", width: 640, height: 360, durationSeconds: 26, sourceTimestamp: "0:22:06" },
    },
    {
      timestamp: "0:35:45", title: "次回の案内と結びの挨拶", body: "次回の配信は未定で、ファンルームとSNSで知らせると案内し、セミファイナルへの感謝を伝えて大学へ向かいました。",
      clip: { src: "/media/live-clips/mily-b258-13-20261109-morning-closing-talk.mp4", poster: "/media/live-clips/mily-b258-13-20261109-morning-closing-talk-poster.jpg", width: 640, height: 360, durationSeconds: 22, sourceTimestamp: "0:35:45" },
    },
  ],
  goals: [],
  ranking: [buildRankingNote(9, 1)],
  timeline: [
    { timestamp: "0:03:03", label: "昨夜の100日記念配信の振り返り" },
    { timestamp: "0:08:06", label: "友達と大学の予定" },
    { timestamp: "0:13:00", label: "結果発表を待つ気持ち" },
    { timestamp: "0:19:14", label: "きっかけ配信の話" },
    { timestamp: "0:21:36", label: "応援してくれる人の夢の話" },
    { timestamp: "0:22:06", label: "ファイナルへ向けた気持ち" },
    { timestamp: "0:34:30", label: "終了時の順位読み上げ" },
    { timestamp: "0:35:45", label: "次回の案内と結びの挨拶" },
  ],
  nextNote: "配信時点では、次回の配信は未定で、決まり次第ファンルームとSNSで案内するとしていました。夜の配信ができる場合も、時間は未定としていました。",
  sourceLabel: "2026年11月9日 朝のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-09",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "本文は自動文字起こしに基づく要約で、原音の手動聴取・逐語校正は未実施です。時刻は録画先頭からの目安です。保存録画の実尺は36分24.640秒で、録画開始から保存処理の終了までの時計上の幅とは約49秒異なります。録画の全区間の連続性は未確認です。短尺は原音付きで、歌唱のない雑談部分から切り出しています。",
  }),
};
