import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["0:07:30", "昼の笑顔", "青いトップス姿で笑顔を見せるみりぃ"],
  ["0:10:30", "飲み物とおしゃべり", "飲み物のストローを手に笑うみりぃ"],
  ["0:13:30", "指を立てて", "片手の指を立てながら話すみりぃ"],
  ["0:23:02", "穏やかににっこり", "カメラを見て穏やかに笑うみりぃ"],
  ["0:31:30", "両手を動かして", "少し離れた位置で両手を動かすみりぃ"],
  ["0:49:30", "カメラへ笑顔", "カメラの近くで明るく笑うみりぃ"],
  ["0:52:34", "顔を傾けて", "少し顔を傾けながら話すみりぃ"],
  ["1:10:30", "両手のポーズ", "笑顔で両手の指を広げるみりぃ"],
  ["1:31:30", "歌の前のおしゃべり", "歌う前にカメラへ話すみりぃ"],
  ["1:34:34", "場所を変えて", "白い扉の前からカメラを見るみりぃ"],
  ["1:40:30", "頬に指を添えて", "両手の人差し指を頬に添えて笑うみりぃ"],
  ["1:46:30", "リボンと笑顔", "黒いリボンのそばに手を添えて笑うみりぃ"],
];
const stills: StreamRecapImage[] = moments.map(([time, caption, alt], i) => ({
  src: `/media/live/mily-b157-${String(i + 1).padStart(2, "0")}-day.jpg`,
  width: 640, height: 360, alt, caption: `${time} ${caption}`,
  downloadName: `みりぃ_20260924昼_${String(i + 1).padStart(2, "0")}.jpg`,
}));

export const streamRecap20260924Day: StreamRecap = {
  id: "2026-09-24-day-showroom",
  date: "2026-09-24", dateLabel: "2026.09.24（木）",
  theme: "昼のまったりトークと音楽",
  broadcastLabel: "14:00頃〜 約115分", platformLabel: "SHOWROOM",
  summary: "大学から早く帰れた午後、みんなと話したくて始めた昼配信。ギフトに合わせた動きで笑い、吹奏楽の思い出や四次審査への思いを語りました。後半には篠笛と歌も届けた、音楽いっぱいのおしゃべり時間です。",
  image: stills[7], gallery: stills,
  galleryZip: { src: "/media/live/mily-b157-day-stills.zip", filename: "みりぃ_20260924昼_スクショ12枚.zip", label: "12枚まとめて保存" },
  songs: [
    { title: "自由への扉", artist: "小此木麻里", timestamp: "1:34:45", youtubeUrl: "https://www.youtube.com/watch?v=6E2ZGtMQdYs" },
    { title: "高嶺の花子さん", artist: "back number", timestamp: "1:38:26", youtubeUrl: "https://www.youtube.com/watch?v=SII-S-zCg-c" },
  ],
  highlights: [
    { timestamp: "0:02:33", title: "大学帰りの昼配信", body: "大学が早く終わり、帰宅後に配信をスタート。急な時間でもみんなとお話ししたい、新しい出会いもあればうれしいと話しました。" },
    { timestamp: "0:12:57", title: "ゆったりまったり話そう", body: "お昼はゆったりおしゃべりする時間、と参加を呼びかけました。窓の向こうのきれいな空の話にもなり、笑顔で会話を続けます。", clip: { src: "/media/live-clips/mily-b157-day-talk.mp4", poster: stills[0].src, width: 640, height: 360, durationSeconds: 22.6, sourceTimestamp: "0:12:57" } },
    { timestamp: "0:27:39", title: "ギフトに合わせて動きを練習", body: "もらったギフトにちゃんと応えたいと、両手を動かしてリアクションを練習。イカやタコの動きをめぐるやり取りで、笑いが広がりました。" },
    { timestamp: "0:43:05", title: "吹奏楽とトロンボーン", body: "吹奏楽の経験から、担当していたのはトロンボーンと紹介。キャプテンを務めたことにも触れ、楽器や音楽の話が弾みました。" },
    { timestamp: "0:48:33", title: "勇気を出してここまで", body: "勇気が出ず配信を始めるのが遅れたことを振り返り、それでもここまで続けられたと話しました。四次審査でも、みんなと上を目指したいと応援を呼びかけます。" },
    { timestamp: "1:17:07", title: "特技の篠笛をお披露目", body: "横に構えて吹く篠笛を紹介し、音量への気遣いも添えて演奏。久しぶりのお披露目のあとも、楽器の話が続きました。" },
    { timestamp: "1:34:15", title: "場所を変えて歌の時間", body: "場所を移して「自由への扉」を、途中に会話を挟みながら歌唱。続いて「高嶺の花子さん」も歌い、おしゃべりとは違う表情を見せてくれました。" },
    { timestamp: "1:50:44", title: "ランキングと長い昼枠のお礼", body: "13位から1位までランキングを読み上げ、長いおしゃべりや演奏に付き合ってくれたことへ感謝。夜もまた話そうと呼びかけて締めくくりました。" },
  ],
  goals: [], ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:02:33", label: "早く帰宅できた日の昼配信" },
    { timestamp: "0:12:57", label: "ゆったり話す昼時間へのお誘い" },
    { timestamp: "0:15:01", label: "アバター作りの話" },
    { timestamp: "0:27:39", label: "ギフトに合わせたリアクション" },
    { timestamp: "0:38:20", label: "吹奏楽の仲間との再会" },
    { timestamp: "0:43:05", label: "担当楽器はトロンボーン" },
    { timestamp: "0:48:33", label: "四次審査に向けた応援のお願い" },
    { timestamp: "1:17:07", label: "篠笛の紹介と演奏" },
    { timestamp: "1:34:45", label: "自由への扉の歌唱" },
    { timestamp: "1:38:26", label: "高嶺の花子さんの歌唱" },
    { timestamp: "1:50:44", label: "13位から1位までのお礼" },
    { timestamp: "1:53:39", label: "夜21時の案内と締めの挨拶" },
  ],
  nextNote: "配信時点では、同日9月24日の21時から夜配信をする予定と案内していました。",
  sourceLabel: "2026年9月24日 SHOWROOM昼配信（オーナー提供録画・自動文字起こし確認）",
  verifiedAt: "2026-09-24",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム12枚を掲載しています。",
    extra: "録画開始記録13:59:50、メディア実測6875.908秒から、表示を14:00頃・約115分に丸めています。録画範囲を58分割して自動文字起こしを確認し、主要な話題は該当区間を別モデルでも再照合しました。全編の手動聴取・逐語校正ではありません。時刻は録画先頭からの目安です。短尺は実映像と原音を使ったファン編集です。",
  }),
};
