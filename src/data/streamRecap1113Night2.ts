import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const moments = [
  ["0:01:30", "opening", "開始直後に話す場面"],
  ["0:08:00", "lean-in", "身を乗り出して話す場面"],
  ["0:29:12", "big-smile", "明るい笑顔"],
  ["0:34:00", "laugh", "あごに手を当てて笑う場面"],
  ["0:38:00", "close-up", "近くで話す場面"],
  ["0:46:00", "cat-ears-smile", "白い猫耳をつけた笑顔"],
  ["0:53:00", "cat-ears-pout", "白い猫耳をつけて口をとがらせる場面"],
  ["0:56:35", "big-laugh", "身を乗り出して大きく笑う場面"],
  ["1:08:00", "calm-look", "穏やかな表情"],
  ["1:15:00", "head-tilt", "首をかしげて話す場面"],
] as const;

export const night1113Slot2Gallery: StreamRecapImage[] = moments.map(([time, slug, label], i) => {
  const filename = `mily-b264-${String(i + 1).padStart(2, "0")}-20261113-night2-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt: `みりぃの${label}`, caption: `${time}｜${label}`, downloadName: filename };
});

export const streamRecap1113Night2: StreamRecap = {
  id: "2026-11-13-night-2-showroom",
  date: "2026-11-13",
  dateLabel: "2026.11.13（金）",
  theme: "夜のゲリラ第2枠トーク",
  broadcastLabel: "22:01頃〜 約82分",
  platformLabel: "SHOWROOM",
  summary: "11月13日夜の第2枠は、第1枠の終了から間もなく予告なく始まったゲリラ配信でした。計算トークや白い猫耳の話題で笑いの多い時間になり、歌は「時の流れに身をまかせ」を途中まで歌いました。最後はランキングの読み上げと点呼で締めました。",
  image: night1113Slot2Gallery[5],
  gallery: night1113Slot2Gallery,
  galleryZip: {
    src: "/media/live/mily-b264-20261113-night2-photos.zip",
    filename: "mily-20261113-night2-photos.zip",
    label: "この回のスクショ10枚をまとめて保存",
  },
  highlights: [
    { timestamp: "0:00:30", title: "ゲリラで始まった第2枠", body: "第1枠の終了から間もなく、予告なく始まりました。戻ってきた人たちへのあいさつや、充電のトラブルの話でにぎやかな立ち上がりでした。" },
    { timestamp: "0:14:30", title: "2桁どうしの計算トーク", body: "インド式の計算や99×99の話題から、2桁×2桁を暗算で解く人の話になりました。計算の工夫を教え合う場面もありました。" },
    { timestamp: "0:20:30", title: "イベントの相談が続く時間", body: "参加中の湘南PRイベントを続けるか迷う相談が続きました。第1枠で話しきれなかった分を、あらためて集まった人たちと相談していました。" },
    { timestamp: "0:38:15", title: "白い猫耳と「にゃんにゃん」", body: "触角や自作アバターの話題が続く中で、白い猫耳と肉球の手袋をつけ、アカペラで「にゃんにゃん」と歌う場面がありました。" },
    { timestamp: "0:44:42", title: "モットーは「喜怒哀楽を楽しむ」", body: "今週のラジオのテーマ「成長」の話から、人生のモットーと、王貞治さんの「努力は必ず報われる」という言葉をどう受け止めているかを話しました。", clip: { src: "/media/live-clips/mily-b264-11-20261113-night2-motto.mp4", poster: "/media/live-clips/mily-b264-11-20261113-night2-motto-poster.jpg", width: 640, height: 360, durationSeconds: 23.7, sourceTimestamp: "0:44:42" } },
    { timestamp: "0:57:22", title: "ギフメは1日5人ずつ返信", body: "ギフトへのお礼のメッセージは1件ずつ丁寧に作っていて、1日5人ぐらいずつしか返せないと話しました。順番を待ってほしいという呼びかけもありました。", clip: { src: "/media/live-clips/mily-b264-12-20261113-night2-gift-replies.mp4", poster: "/media/live-clips/mily-b264-12-20261113-night2-gift-replies-poster.jpg", width: 640, height: 360, durationSeconds: 18.5, sourceTimestamp: "0:57:22" } },
    { timestamp: "1:00:15", title: "「時の流れに身をまかせ」は途中まで", body: "「時の流れに身をまかせ」を歌いかけましたが、歌詞とメロディを思い出せず、途中で止めて次の機会に歌うことにしました。音感の話題にもなりました。" },
    { timestamp: "1:14:15", title: "読み上げと点呼で締め", body: "終盤はライブランキングの読み上げと点呼があり、「おつみりぃ／おやすみりぃ」のあいさつで締めました。湘南PRのぼり応援大使決定戦は3位と表示されましたが、表示された値であり確定値ではありません。" },
  ],
  goals: [],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:30", label: "ゲリラで開始" },
    { timestamp: "0:03:00", label: "充電トラブルと猫の話題" },
    { timestamp: "0:08:30", label: "パソコンやAIツールの不具合の話題" },
    { timestamp: "0:14:30", label: "計算トーク" },
    { timestamp: "0:20:30", label: "イベントの相談" },
    { timestamp: "0:30:00", label: "触角と自作アバターの話題" },
    { timestamp: "0:38:15", label: "白い猫耳と「にゃんにゃん」" },
    { timestamp: "0:44:42", label: "モットーの話題" },
    { timestamp: "0:53:30", label: "前髪とつむじの話題" },
    { timestamp: "0:57:22", label: "ギフメ返信の話" },
    { timestamp: "1:00:15", label: "「時の流れに身をまかせ」（途中まで）" },
    { timestamp: "1:08:00", label: "クリスマスソングの話題" },
    { timestamp: "1:13:05", label: "翌朝の配信案内" },
    { timestamp: "1:14:15", label: "ランキング読み上げと点呼" },
    { timestamp: "1:21:15", label: "おつみりぃ" },
  ],
  nextNote: "配信時点では、翌朝4時30分からの「きっかけ」枠と、5時30分からの通常枠が案内されていました。",
  sourceLabel: "2026年11月13日 夜のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-14",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "保存録画の実尺は82分03秒です。SHOWROOMのAPIで保存したコメント記録は22時24分で停止しており、それ以降は録画と視聴記録で確認しています。湘南PRのぼり応援大使決定戦の順位は配信中の表示の値で、確定値ではありません。歌唱として確認できたのは「時の流れに身をまかせ」を途中まで歌った場面で、ほかに英語の歌やクリスマスソングの断片を口ずさむ場面がありました。",
  }),
};
