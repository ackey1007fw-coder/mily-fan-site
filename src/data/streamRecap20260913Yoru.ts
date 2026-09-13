import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b117-01-bright-opening-smile.jpg", width: 640, height: 360, alt: "9月13日の夜配信、カメラの近くで明るく笑うみりぃ", caption: "配信序盤の明るい笑顔", downloadName: "みりぃ_20260913夜_01.jpg" },
  { src: "/media/live/mily-b117-02-soft-smile.jpg", width: 640, height: 360, alt: "9月13日の夜配信、やわらかな笑顔でカメラを見るみりぃ", caption: "やわらかな表情でトーク", downloadName: "みりぃ_20260913夜_02.jpg" },
  { src: "/media/live/mily-b117-03-cheek-pose.jpg", width: 640, height: 360, alt: "9月13日の夜配信、両手を頬に添えるみりぃ", caption: "両手を頬に添えて", downloadName: "みりぃ_20260913夜_03.jpg" },
  { src: "/media/live/mily-b117-04-hands-open-pose.jpg", width: 640, height: 360, alt: "9月13日の夜配信、両手を広げたポーズのみりぃ", caption: "両手を広げたポーズ", downloadName: "みりぃ_20260913夜_04.jpg" },
  { src: "/media/live/mily-b117-05-finger-smile-pose.jpg", width: 640, height: 360, alt: "9月13日の夜配信、両手の指で笑顔を示すみりぃ", caption: "笑顔を指さすポーズ", downloadName: "みりぃ_20260913夜_05.jpg" },
  { src: "/media/live/mily-b117-06-bright-smile.jpg", width: 640, height: 360, alt: "9月13日の夜配信、カメラに向かって笑顔を見せるみりぃ", caption: "カメラに向けた笑顔", downloadName: "みりぃ_20260913夜_06.jpg" },
  { src: "/media/live/mily-b117-07-gentle-smile.jpg", width: 640, height: 360, alt: "9月13日の夜配信、やさしく微笑むみりぃ", caption: "穏やかな笑顔でトーク", downloadName: "みりぃ_20260913夜_07.jpg" },
  { src: "/media/live/mily-b117-08-close-smile.jpg", width: 640, height: 360, alt: "9月13日の夜配信、カメラに近づいて笑顔を見せるみりぃ", caption: "カメラの近くでにっこり", downloadName: "みりぃ_20260913夜_08.jpg" },
  { src: "/media/live/mily-b117-09-late-smile.jpg", width: 640, height: 360, alt: "9月13日の夜配信、終盤に明るく微笑むみりぃ", caption: "終盤にも明るい笑顔", downloadName: "みりぃ_20260913夜_09.jpg" },
  { src: "/media/live/mily-b117-10-closing-smile.jpg", width: 640, height: 360, alt: "9月13日の夜配信、締めに向けてカメラを見るみりぃ", caption: "締めに向けた穏やかな表情", downloadName: "みりぃ_20260913夜_10.jpg" },
];

export const streamRecap20260913Yoru: StreamRecap = {
  id: "2026-09-13-yoru-showroom",
  date: "2026-09-13",
  dateLabel: "2026.09.13（日）",
  theme: "夜の幸せ涙と投票最終日",
  broadcastLabel: "22:31頃〜 約107分",
  platformLabel: "SHOWROOM",
  summary: "ラジオを終えた夜、応援していた仲間の挑戦を喜び、幸せの涙からスタート。放送への感謝、アバター権と配信44日目、WEB投票最終日の呼びかけ、ファイナルを目指す思いまで語りました。",
  image: approvedStills[5],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b117-night-stills.zip", filename: "みりぃ_20260913夜_スクショ10枚.zip", label: "10枚まとめて保存" },
  highlights: [
    {
      timestamp: "0:00:39",
      title: "幸せの涙からスタート",
      body: "応援していた仲間の挑戦が実を結ぶ場面を見届け、頑張りを知っているからこそ嬉しくて涙が出たと話しました。",
    },
    {
      timestamp: "0:07:05",
      title: "ラジオの余韻と感謝",
      body: "同日のラジオを振り返り、届いたメッセージや聴いてくれた人へ感謝しました。放送もとても楽しかったと話しました。",
    },
    {
      timestamp: "0:31:56",
      title: "アバター権達成を改めて",
      body: "目標だったアバター権を獲得できたと喜び、応援への感謝を伝えました。配信後にアバター申請を進めたいとも話しました。",
    },
    {
      timestamp: "0:35:39",
      title: "配信44日目",
      body: "この日で配信開始から44日目だと振り返り、まだ初心者だと話しながら、ルームのみんなと一緒に成長していく空気を楽しみました。",
    },
    {
      timestamp: "0:53:13",
      title: "リコピンと栄養素の意味",
      body: "「リコピン」がトマトの栄養素であることから、一人ひとりが集まって一つのトマトを育てるイメージを込めたと説明しました。",
    },
    {
      timestamp: "1:15:01",
      title: "ラジオと配信の自分",
      body: "ラジオでは少し落ち着いた口調になると言われ、配信との違いは自分では無意識だと話しました。",
    },
    {
      timestamp: "1:26:20",
      title: "WEB投票最終日のお願い",
      body: "9月13日がWEB投票最終日だと案内し、プロフィールやバナーから参加できると最後まで呼びかけました。",
    },
    {
      timestamp: "1:35:04",
      title: "ファイナルを目指して",
      body: "ファイナルまで進むつもりだと語り、ルームをさらに育てながら、今応援してくれる一人ひとりを大切にしていきたいと話しました。",
    },
  ],
  goals: [
    { item: "WEB投票", target: "最終日", statusThen: "最後まで呼びかけ" },
    { item: "ファイナル", target: "進出", statusThen: "目指す思いを共有" },
  ],
  ranking: [buildRankingNote(13, 1, "during")],
  timeline: [
    { timestamp: "0:00:39", label: "仲間の挑戦を喜び幸せの涙" },
    { timestamp: "0:07:05", label: "同日のラジオを振り返る" },
    { timestamp: "0:13:24", label: "プール前の冷たいシャワーの話" },
    { timestamp: "0:18:04", label: "ラジオへのメッセージに感謝" },
    { timestamp: "0:23:10", label: "3時間のラジオ生放送を紹介" },
    { timestamp: "0:25:58", label: "テーマ「ひとり○○」を振り返る" },
    { timestamp: "0:31:56", label: "アバター権獲得を改めて報告" },
    { timestamp: "0:35:39", label: "配信開始から44日目" },
    { timestamp: "0:36:31", label: "アバター申請の話" },
    { timestamp: "0:52:36", label: "トマトの栄養素を紹介" },
    { timestamp: "1:15:01", label: "ラジオと配信の違いをトーク" },
    { timestamp: "1:20:43", label: "0時のWEB投票を意識" },
    { timestamp: "1:26:20", label: "WEB投票最終日のお願い" },
    { timestamp: "1:35:04", label: "ファイナルを目指す思い" },
    { timestamp: "1:38:42", label: "13位から1位のランキング読み上げ" },
    { timestamp: "1:44:42", label: "翌日の配信時間を相談" },
  ],
  nextNote: "配信時点では、翌9月14日は早朝枠を休んで9:30頃に配信する案へ変え、ファンルームで改めて案内すると話していました。夜も配信する予定で、またぎになる可能性にも触れていました。",
  sourceLabel: "2026年9月13日 SHOWROOM夜配信（オーナー提供録画の自動文字起こしと実フレームを照合）",
  verifiedAt: "2026-09-14",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。",
    extra: "録画開始22:31:18とメディア実測6435.493秒を確認し、表示は22:31頃・約107分に丸めています。自動文字起こし全1,988区間を通読し、ラジオの振り返り、アバター権、配信44日目、WEB投票最終日、ファイナルへの思い、終盤のランキングと翌日の案内を確認しました。全編手動聴取は実施していません。録画全体を概観し、候補の前後も比較したうえで、第三者やコメント欄が写らない実フレーム10枚を実寸確認しました。",
  }),
};
