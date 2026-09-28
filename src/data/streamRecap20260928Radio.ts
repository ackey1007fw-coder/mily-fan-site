import type { StreamRecap } from "./streamRecaps.ts";
import { streamRecap20260926Radio } from "./streamRecap20260926Radio.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260928Radio: StreamRecap = {
  id: "2026-09-28-morning-radio",
  date: "2026-09-28",
  dateLabel: "2026.09.28（月）",
  theme: "朝の声と照らし合う時間",
  broadcastLabel: "5:41頃〜 約68分",
  platformLabel: "SHOWROOM",
  summary: "写真を表示した朝のラジオ配信。呼び名の由来や声で伝えること、ラジオでの話し方を語りました。終盤は互いを照らし合うような応援に感謝し、朝のひとときを締めくくりました。",
  image: streamRecap20260926Radio.image,
  highlights: [
    {
      timestamp: "0:00:33",
      title: "声で始まる朝",
      body: "この朝はラジオ形式で配信を開始。来てくれた人に声であいさつしながら、おしゃべりを始めました。",
    },
    {
      timestamp: "0:10:00",
      title: "タコの踊りの話",
      body: "前日の動きを思い出し、タコの踊りについて声で話しました。この回の画面は写真のままです。",
    },
    {
      timestamp: "0:18:00",
      title: "アバターの広がり",
      body: "自分のアバターが広まっていることを喜び、使ってくれる人たちへの感謝を伝えました。",
    },
    {
      timestamp: "0:22:00",
      title: "みりぃという呼び名",
      body: "「みりぃ」という呼び名の由来を話しました。初めて来た人にも自分のことを伝えるひと幕です。",
    },
    {
      timestamp: "0:26:00",
      title: "声に自信をくれた言葉",
      body: "声や話し方への感想を受け取り、自信につながっていると話しました。",
    },
    {
      timestamp: "0:54:30",
      title: "お互いを照らし合う",
      body: "応援してくれるみんなと自分は、互いを照らし合っていると話す場面。原音付きの短い抜粋を掲載しています。",
      clip: {
        src: "/media/live-clips/mily-b171-01-20260928-morning-mutual-light-005430.mp4",
        poster: "/media/live/mily-b164-01-morning-radio.jpg",
        width: 640,
        height: 360,
        durationSeconds: 9.8,
        sourceTimestamp: "0:54:30",
      },
    },
    {
      timestamp: "0:58:00",
      title: "ドライブの時間",
      body: "景色を眺めるドライブの話へ。目的地までの時間を長く楽しめるから、渋滞も好きだと話しました。",
    },
    {
      timestamp: "1:04:00",
      title: "朝のありがとう",
      body: "終盤はランキングを読み上げ、集まった人たちにお礼を伝えて締めくくりました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:33", label: "ラジオ形式で朝のあいさつ" },
    { timestamp: "0:10:00", label: "タコの踊りについて声で話す" },
    { timestamp: "0:18:00", label: "アバターへの反応" },
    { timestamp: "0:22:00", label: "みりぃという呼び名の由来" },
    { timestamp: "0:26:00", label: "声への感想と自信" },
    { timestamp: "0:28:00", label: "前日のラジオを振り返る" },
    { timestamp: "0:36:00", label: "ラジオでの話し方" },
    { timestamp: "0:43:00", label: "同日夜の配信について相談" },
    { timestamp: "0:54:30", label: "互いを照らし合う応援" },
    { timestamp: "0:58:00", label: "ドライブと景色の話" },
    { timestamp: "1:04:00", label: "ランキングとお礼" },
  ],
  nextNote: "配信時点では、同日夜に配信したいと話していました。時刻は検討中でした。",
  sourceLabel: "2026年9月28日 SHOWROOM朝ラジオ配信（保存録画・自動文字起こし確認）",
  verifiedAt: "2026-09-29",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    publishedClips: true,
    stills: "静止画は録画内の離れた10時点で同じ写真と確認し、既存の同じ画像を1枚だけ掲載しています。",
    extra: "録画開始記録05:41:13、メディア実測4060.245秒。完了済み34区間の自動文字起こし全体を確認しました。短尺は同じ録画の原音付き9.8秒で、音声トラックと全尺デコードを確認しています。全編の手動聴取・逐語校正は未実施です。録画終了記録との差があり、完全な連続収録とは認定していません。時刻は録画先頭からの目安です。今回の確認範囲で歌唱曲は確定していません。",
  }),
};
