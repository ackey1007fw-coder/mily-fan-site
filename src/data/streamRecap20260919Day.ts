import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b133-01-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "リボン姿の笑顔のみりぃ",
    "caption": "0:27:15 リボン姿の笑顔",
    "downloadName": "みりぃ_20260919昼_01.jpg"
  },
  {
    "src": "/media/live/mily-b133-02-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラに向けた笑顔のみりぃ",
    "caption": "0:34:13 カメラに向けた笑顔",
    "downloadName": "みりぃ_20260919昼_02.jpg"
  },
  {
    "src": "/media/live/mily-b133-03-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "髪を下ろして笑顔のみりぃ",
    "caption": "0:43:16 髪を下ろして笑顔",
    "downloadName": "みりぃ_20260919昼_03.jpg"
  },
  {
    "src": "/media/live/mily-b133-04-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "メイク終盤の表情のみりぃ",
    "caption": "0:43:58 メイク終盤の表情",
    "downloadName": "みりぃ_20260919昼_04.jpg"
  },
  {
    "src": "/media/live/mily-b133-05-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラに近づいた笑顔のみりぃ",
    "caption": "0:45:48 カメラに近づいた笑顔",
    "downloadName": "みりぃ_20260919昼_05.jpg"
  },
  {
    "src": "/media/live/mily-b133-06-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "手のひらとピースのみりぃ",
    "caption": "0:46:14 手のひらとピース",
    "downloadName": "みりぃ_20260919昼_06.jpg"
  },
  {
    "src": "/media/live/mily-b133-07-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "手を広げたポーズのみりぃ",
    "caption": "0:46:20 手を広げたポーズ",
    "downloadName": "みりぃ_20260919昼_07.jpg"
  },
  {
    "src": "/media/live/mily-b133-08-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤の手振りのみりぃ",
    "caption": "0:47:50 終盤の手振り",
    "downloadName": "みりぃ_20260919昼_08.jpg"
  }
];

export const streamRecap20260919Day: StreamRecap = {
  id: "2026-09-19-day-showroom",
  date: "2026-09-19",
  dateLabel: "2026.09.19（土）",
  theme: "昼のメイクと笑顔",
  broadcastLabel: "14:41頃〜 約48分",
  platformLabel: "SHOWROOM",
  summary: "青い服とリボン姿で、お話ししながらメイクを進めた昼配信。四次審査への思いも伝え、まつ毛やチークを仕上げて笑顔を見せました。最後は応援へのお礼と、夜の配信について案内しています。",
  image: stills[2],
  gallery: stills,
  galleryZip: {
    src: "/media/live/mily-b133-day-stills.zip",
    filename: "みりぃ_20260919昼_スクショ8枚.zip",
    label: "8枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:01:05",
      title: "お話ししながらメイク",
      body: "青い服とリボン姿でメイク配信を開始。限られた時間をみんなと過ごしたいと話し、初めて訪れた人にも自己紹介をしていました。",
    },
    {
      timestamp: "0:02:26",
      title: "四次審査へ一緒に",
      body: "10月2日からの四次審査へ向けて、一緒に歩んでいきたいと呼びかけました。ルーム名も四次審査の案内へ変えたことを紹介しています。",
    },
    {
      timestamp: "0:09:42",
      title: "左利きで進めるメイク",
      body: "左利きでメイクしていることを紹介。配信の終わり際に会話が盛り上がると、終わりたくなくなると笑って話しました。",
    },
    {
      timestamp: "0:30:36",
      title: "配信を重ねて手際よく",
      body: "配信を重ねるうちにメイクが早くなってきたと振り返りました。仕上がりを確かめながら、まつ毛など残りの工程を進めていきます。",
    },
    {
      timestamp: "0:36:27",
      title: "まつ毛と気持ちを上向きに",
      body: "まつ毛が上がると気分も上がると、メイクの楽しさを紹介。朝に続いて昼も来てくれたことへの感謝を伝えていました。",
    },
    {
      timestamp: "0:41:27",
      title: "チークを重ねて仕上げ",
      body: "忘れていたチークを追加。薄めの色に濃い色を重ね、ふんわりした仕上がりにする工程を説明しました。",
    },
    {
      timestamp: "0:43:03",
      title: "完成したメイクをお披露目",
      body: "髪を下ろし、仕上がったメイクを笑顔でお披露目。リップにもつやを足し、寄せられた言葉に嬉しそうに応えていました。",
    },
    {
      timestamp: "0:47:58",
      title: "笑顔で次の配信へ",
      body: "来てくれた人へお礼を伝え、フォローして次も会おうと呼びかけました。最後はカメラに向かって手を振っていました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:03", label: "開始の挨拶" },
    { timestamp: "0:01:05", label: "メイク配信のスタート" },
    { timestamp: "0:02:26", label: "四次審査への呼びかけ" },
    { timestamp: "0:06:32", label: "会話とメイクの時間" },
    { timestamp: "0:09:42", label: "左利きのメイクの話" },
    { timestamp: "0:21:57", label: "目元のメイクに集中" },
    { timestamp: "0:30:36", label: "メイクの手際の変化" },
    { timestamp: "0:31:53", label: "審査の詳細は後日案内" },
    { timestamp: "0:33:06", label: "リップ選び" },
    { timestamp: "0:36:11", label: "まつ毛の仕上げ" },
    { timestamp: "0:41:27", label: "チークを重ねる工程" },
    { timestamp: "0:43:03", label: "メイク完成のお披露目" },
    { timestamp: "0:44:50", label: "夜の配信時刻について" },
    { timestamp: "0:45:45", label: "ランキングのお礼" },
    { timestamp: "0:47:58", label: "フォローの呼びかけと挨拶" },
  ],
  nextNote: "配信時点では同日22:30からの予定でしたが、23:00や23:30へ遅れる可能性もあると案内。正確な時刻はファンルームで改めて報告すると話していました。",
  sourceLabel: "2026年9月19日 SHOWROOM昼配信（オーナー提供録画・対応動画の自動字幕確認）",
  verifiedAt: "2026-09-19",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム8枚を掲載しています。",
    extra: "同一録画と照合済みの動画に付いた日本語自動字幕883区間を確認し、録画実フレームと照合しました。全編の手動聴取ではありません。録画開始記録14:41:42、実測2891.459秒から約48分としています。時刻は録画先頭からの目安で、完全収録は保証しません。歌の話題や短い口ずさみは確定歌唱曲と区別しています。",
  }),
};
