import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const gallery =
[
  {
    "src": "/media/live/mily-b180-01-20261002-morning-000630.jpg",
    "width": 640,
    "height": 360,
    "alt": "首を少し傾けて笑うみりぃ",
    "caption": "0:06:30｜首を少し傾けて笑うみりぃ",
    "downloadName": "mily-b180-01-20261002-morning-000630.jpg"
  },
  {
    "src": "/media/live/mily-b180-02-20261002-morning-002032.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラに向かって話すみりぃ",
    "caption": "0:20:32｜カメラに向かって話すみりぃ",
    "downloadName": "mily-b180-02-20261002-morning-002032.jpg"
  },
  {
    "src": "/media/live/mily-b180-03-20261002-morning-002628.jpg",
    "width": 640,
    "height": 360,
    "alt": "指を三本立てるみりぃ",
    "caption": "0:26:28｜指を三本立てるみりぃ",
    "downloadName": "mily-b180-03-20261002-morning-002628.jpg"
  },
  {
    "src": "/media/live/mily-b180-04-20261002-morning-003030.jpg",
    "width": 640,
    "height": 360,
    "alt": "正面を見て話すみりぃ",
    "caption": "0:30:30｜正面を見て話すみりぃ",
    "downloadName": "mily-b180-04-20261002-morning-003030.jpg"
  },
  {
    "src": "/media/live/mily-b180-05-20261002-morning-003230.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔で手を振るみりぃ",
    "caption": "0:32:30｜笑顔で手を振るみりぃ",
    "downloadName": "mily-b180-05-20261002-morning-003230.jpg"
  },
  {
    "src": "/media/live/mily-b180-06-20261002-morning-004230.jpg",
    "width": 640,
    "height": 360,
    "alt": "あごに手を添えるみりぃ",
    "caption": "0:42:30｜あごに手を添えるみりぃ",
    "downloadName": "mily-b180-06-20261002-morning-004230.jpg"
  },
  {
    "src": "/media/live/mily-b180-07-20261002-morning-005030.jpg",
    "width": 640,
    "height": 360,
    "alt": "頭の上で手を合わせるみりぃ",
    "caption": "0:50:30｜頭の上で手を合わせるみりぃ",
    "downloadName": "mily-b180-07-20261002-morning-005030.jpg"
  },
  {
    "src": "/media/live/mily-b180-08-20261002-morning-005428.jpg",
    "width": 640,
    "height": 360,
    "alt": "髪に手を添えて笑うみりぃ",
    "caption": "0:54:28｜髪に手を添えて笑うみりぃ",
    "downloadName": "mily-b180-08-20261002-morning-005428.jpg"
  },
  {
    "src": "/media/live/mily-b180-09-20261002-morning-010430.jpg",
    "width": 640,
    "height": 360,
    "alt": "人差し指を立てるみりぃ",
    "caption": "1:04:30｜人差し指を立てるみりぃ",
    "downloadName": "mily-b180-09-20261002-morning-010430.jpg"
  },
  {
    "src": "/media/live/mily-b180-10-20261002-morning-010630.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤に明るく笑うみりぃ",
    "caption": "1:06:30｜終盤に明るく笑うみりぃ",
    "downloadName": "mily-b180-10-20261002-morning-010630.jpg"
  }
];

export const streamRecap20261002Asa: StreamRecap = {
  id: "2026-10-02-morning-showroom",
  date: "2026-10-02",
  dateLabel: "2026.10.02（金）",
  theme: "朝の投票スタート準備",
  broadcastLabel: "6:01頃〜 約70分",
  platformLabel: "SHOWROOM",
  summary: "当日正午に始まるWEB投票を前に、みんなへ応援を呼びかけました。翌日からのSHOWROOM審査や、主催者の無料ギフト審査案内も確認。コメントに応えながら、一緒に頑張りたい気持ちを伝える朝でした。",
  image: gallery[9],
  gallery,
  galleryNote: "朝配信の実フレームから、表情やしぐさの異なる10枚を選びました。時刻は録画先頭からの目安です。",
  highlights: [
    { timestamp: "0:03:39", title: "正午から始まるWEB投票", body: "この日の正午から投票が始まると案内し、みんなへ応援を呼びかけました。審査を前にしたドキドキも伝えながら、朝の挨拶が続きます。" },
    { timestamp: "0:09:45", title: "一緒に頑張るぞ", body: "応援に来てくれたみんなへ感謝を伝え、一緒に頑張ろうと呼びかけました。コメントに応えながら、審査へ向かう気持ちを共有します。" },
    { timestamp: "0:16:15", title: "忙しい朝も無理なく", body: "金曜日の忙しい朝、無理せず聞いてほしいと呼びかけました。バタバタしながら来てくれるみんなへ、嬉しい気持ちも伝えます。" },
    { timestamp: "0:26:09", title: "翌日からのSHOWROOM審査", body: "WEB投票とSHOWROOM審査の開始日の違いに触れ、SHOWROOMは翌日からと案内しました。審査のページを確認しながら、応援方法を話します。" },
    { timestamp: "0:31:23", title: "無料ギフト審査の案内を確認", body: "主催者サイトの無料ギフト審査の記載をみんなと確認しました。イベント審査とあわせて、応援の準備についてコメントとやりとりします。" },
    { timestamp: "0:48:25", title: "案内コメントのありがたさ", body: "自分で毎回紹介しきれないとき、案内のコメントが助けになると話しました。応援方法を伝えてくれるみんなへの感謝も続きます。" },
    { timestamp: "1:09:33", title: "みんなの一日へエール", body: "朝から来てくれたみんなへお礼を伝え、良い一日になりますようにと送り出しました。四次審査への応援をお願いし、朝の配信を締めます。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:50", label: "朝の挨拶" },
    { timestamp: "0:03:39", label: "当日正午からのWEB投票" },
    { timestamp: "0:09:45", label: "みんなと一緒に頑張る呼びかけ" },
    { timestamp: "0:10:34", label: "投票の操作確認と夜配信の案内" },
    { timestamp: "0:16:15", label: "忙しい朝の視聴への気遣い" },
    { timestamp: "0:26:09", label: "翌日からのSHOWROOM審査" },
    { timestamp: "0:31:23", label: "主催者の無料ギフト審査案内を確認" },
    { timestamp: "0:48:25", label: "ルームの案内コメントへの感謝" },
    { timestamp: "0:57:06", label: "投票と翌日からの審査への呼びかけ" },
    { timestamp: "0:58:31", label: "配信方法とタイムテーブルの相談" },
    { timestamp: "1:05:03", label: "夜21:30からの配信を再案内" },
    { timestamp: "1:07:46", label: "ランキングと朝の応援へのお礼" },
    { timestamp: "1:09:03", label: "投票と応援をあらためてお願い" },
    { timestamp: "1:09:33", label: "みんなの一日へエール" },
  ],
  nextNote: "配信時点では、この日の夜21:30から配信すると案内し、投票の仕方をみんなと確認したいと話していました。",
  sourceLabel: "2026年10月2日 SHOWROOM朝配信（保存録画・自動文字起こし）",
  verifiedAt: "2026-10-02",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の録画から抽出した実フレーム10枚です。顔・身体の生成や補正は行っていません。",
    extra: "時刻は元録画に合わせた目安です。歌唱曲は確認していません。短尺動画は原音の検品待ちのため掲載していません。",
  }),
};
