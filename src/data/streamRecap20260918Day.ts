import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE_WITHOUT_RANGE, buildTranscriptionNote } from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b131-01-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "正面を向いた笑顔のみりぃ",
    "caption": "0:08:35 正面を向いた笑顔",
    "downloadName": "みりぃ_20260918昼_01.jpg"
  },
  {
    "src": "/media/live/mily-b131-02-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "メッセージカードを見せる場面のみりぃ",
    "caption": "0:11:57 メッセージカードを見せる場面",
    "downloadName": "みりぃ_20260918昼_02.jpg"
  },
  {
    "src": "/media/live/mily-b131-03-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手でハートのポーズのみりぃ",
    "caption": "0:28:37 両手でハートのポーズ",
    "downloadName": "みりぃ_20260918昼_03.jpg"
  },
  {
    "src": "/media/live/mily-b131-04-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラに近づいた笑顔のみりぃ",
    "caption": "0:46:54 カメラに近づいた笑顔",
    "downloadName": "みりぃ_20260918昼_04.jpg"
  },
  {
    "src": "/media/live/mily-b131-05-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手を合わせたポーズのみりぃ",
    "caption": "1:06:55 両手を合わせたポーズ",
    "downloadName": "みりぃ_20260918昼_05.jpg"
  },
  {
    "src": "/media/live/mily-b131-06-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "髪に手を添えた笑顔のみりぃ",
    "caption": "1:11:54 髪に手を添えた笑顔",
    "downloadName": "みりぃ_20260918昼_06.jpg"
  },
  {
    "src": "/media/live/mily-b131-07-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "首をかしげた笑顔のみりぃ",
    "caption": "1:16:55 首をかしげた笑顔",
    "downloadName": "みりぃ_20260918昼_07.jpg"
  },
  {
    "src": "/media/live/mily-b131-08-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "肩をすくめた笑顔のみりぃ",
    "caption": "1:23:32 肩をすくめた笑顔",
    "downloadName": "みりぃ_20260918昼_08.jpg"
  },
  {
    "src": "/media/live/mily-b131-09-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "胸元に手を添えた場面のみりぃ",
    "caption": "1:38:35 胸元に手を添えた場面",
    "downloadName": "みりぃ_20260918昼_09.jpg"
  },
  {
    "src": "/media/live/mily-b131-10-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔の横に指を広げたポーズのみりぃ",
    "caption": "1:50:15 顔の横に指を広げたポーズ",
    "downloadName": "みりぃ_20260918昼_10.jpg"
  },
  {
    "src": "/media/live/mily-b131-11-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "片手でハートのポーズのみりぃ",
    "caption": "1:51:55 片手でハートのポーズ",
    "downloadName": "みりぃ_20260918昼_11.jpg"
  },
  {
    "src": "/media/live/mily-b131-12-day.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤の笑顔のみりぃ",
    "caption": "2:08:35 終盤の笑顔",
    "downloadName": "みりぃ_20260918昼_12.jpg"
  }
];

export const streamRecap20260918Day: StreamRecap = {
  id: "2026-09-18-day-showroom",
  date: "2026-09-18",
  dateLabel: "2026.09.18（金）",
  theme: "昼の初きっかけ配信と交流",
  broadcastLabel: "13:40頃〜 約135分",
  platformLabel: "SHOWROOM",
  summary: "初めての「きっかけ配信」で、新しく訪れた人と約1時間トーク。その後も通常配信を続け、名前の由来や食べ物の話から、コンテストに挑む理由や一歩踏み出す勇気まで語った昼配信です。",
  image: stills[2],
  gallery: stills,
  galleryZip: { src: "/media/live/mily-b131-day-stills.zip", filename: "みりぃ_20260918昼_スクショ12枚.zip", label: "12枚まとめて保存" },
  highlights: [
    { timestamp: "0:00:25", title: "初めてのきっかけ配信", body: "配信49日目に、初めての「きっかけ配信」に挑戦しました。操作に戸惑いながらも、初訪問の人へ自己紹介し、コメントで話しかけてほしいと呼びかけました。", socialClip: {
    "title": "はじめまして！みりぃです。",
    "sourceTimestamp": "0:01:11",
    "durationSeconds": 27.85,
    "links": [
        {
            "platform": "youtube",
            "url": "https://www.youtube.com/watch?v=wMWy1Dmaq9E"
        },
        {
            "platform": "tiktok",
            "url": "https://www.tiktok.com/@ackeytan_/video/7687035549944646929"
        },
        {
            "platform": "instagram",
            "url": "https://www.instagram.com/reel/Ddct1s_lHEK/"
        },
        {
            "platform": "x",
            "url": "https://x.com/ackey_RiRi_supp/status/2101106012770181423"
        }
    ]
} },
    { timestamp: "0:08:28", title: "ラジオで培った力を試す", body: "ラジオパーソナリティの経験を生かしたいと話しました。今回はナビゲーターを設定せず、自分のトークで新しい人と交流する腕試しにしたと説明しました。" },
    { timestamp: "0:11:50", title: "フォローのお礼はカードに", body: "配信中にフォローしてくれた人へ、メッセージカードでお礼を伝える企画を紹介しました。ファンルームにも載せる予定だと案内し、次も遊びに来てほしいと呼びかけました。" },
    { timestamp: "0:45:29", title: "二度、三度と知ってほしい", body: "一度の訪問だけでは人柄を知りきれないので、二度、三度と来てほしいと話しました。きっかけを入り口に、自分のことを知ってもらいたいと伝えました。" },
    { timestamp: "1:00:29", title: "通常配信へそのまま続行", body: "きっかけ配信を終え、通常配信へ切り替えてトークを続けました。見守っていた人にもお礼を伝え、新しく来た人にも引き続き参加を呼びかけました。" },
    { timestamp: "1:09:32", title: "アバター申請の進捗", body: "アバターの申請が通ったと連絡を受けたことを報告しました。一方で、いつ配布されるのかはまだ分からないと話し、申請の通過と実際の配布を分けて説明しました。" },
    { timestamp: "1:37:18", title: "話題を探して出かける日々", body: "ラジオで面白い話を届けたいので、話題になりそうな場所へ出かけることがあると話しました。少しでも興味を持ったことには足を運びたくなると、自分の行動を振り返りました。" },
    { timestamp: "2:00:29", title: "一歩踏み出す勇気を届けたい", body: "自分に自信を持てるように挑戦を続けたいと話しました。一歩踏み出した先にある未来を、自分の行動で示したいという思いを、コンテストへ出場した理由として語りました。" },
  ],
  goals: [],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:00:25", label: "初めてのきっかけ配信を開始" },
    { timestamp: "0:06:58", label: "初挑戦の緊張と配信49日目" },
    { timestamp: "0:08:28", label: "ナビゲーターを設定しない腕試し" },
    { timestamp: "0:11:50", label: "フォローのお礼のカード企画" },
    { timestamp: "0:45:29", label: "二度、三度と訪れてほしい思い" },
    { timestamp: "1:00:29", label: "きっかけ配信から通常配信へ" },
    { timestamp: "1:09:32", label: "アバター申請通過の連絡を報告" },
    { timestamp: "1:10:58", label: "初めての挑戦を振り返る" },
    { timestamp: "1:22:54", label: "好きな野菜のトーク" },
    { timestamp: "1:23:27", label: "生もみじのおやつタイム" },
    { timestamp: "1:37:18", label: "ラジオの話題を探すお出かけ" },
    { timestamp: "1:51:29", label: "左手で始めた書道の話" },
    { timestamp: "1:54:22", label: "配信を始める前に感じた不安" },
    { timestamp: "2:00:29", label: "一歩踏み出す勇気を示したい思い" },
    { timestamp: "2:11:40", label: "ライブランキング読み上げ" },
    { timestamp: "2:13:27", label: "夜の歌唱予告とファンルームの案内" },
  ],
  nextNote: "配信時点では、夜にも配信し、ぜひ聴いてほしい曲を歌うと予告。時刻は決まり次第ファンルームで案内すると話していました。",
  sourceLabel: "2026年9月18日 SHOWROOM昼配信（オーナー提供録画・自動文字起こし確認）",
  verifiedAt: "2026-09-18",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム12枚を掲載しています。",
    extra: "録画開始記録13:39:52、修復済み記録の実測8108.622秒から表示を13:40頃・約135分に丸めています。保存録画範囲全体を68チャンク・282区間の自動文字起こしで確認しました。後発の短い重複録画との連結はしていません。配信全編の完全収録は保証しません。タイムスタンプは録画先頭からの目安です。独立した歌唱として曲名を確定できた場面はなく、夜の歌唱予告と区別しています。",
  }),
};
