import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE_WITHOUT_RANGE, buildTranscriptionNote } from "./streamRecapRules.ts";

const gallery = [
  {
    "src": "/media/live/mily-b179-01-20261001-night-000100.jpg",
    "width": 640,
    "height": 360,
    "alt": "明るい笑顔を向けるみりぃ",
    "caption": "0:01:00｜明るい笑顔を向けるみりぃ",
    "downloadName": "mily-b179-01-20261001-night-000100.jpg"
  },
  {
    "src": "/media/live/mily-b179-02-20261001-night-000630.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラへ手を振るみりぃ",
    "caption": "0:06:30｜カメラへ手を振るみりぃ",
    "downloadName": "mily-b179-02-20261001-night-000630.jpg"
  },
  {
    "src": "/media/live/mily-b179-03-20261001-night-001430.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔の前で手を合わせるみりぃ",
    "caption": "0:14:30｜顔の前で手を合わせるみりぃ",
    "downloadName": "mily-b179-03-20261001-night-001430.jpg"
  },
  {
    "src": "/media/live/mily-b179-04-20261001-night-001630.jpg",
    "width": 640,
    "height": 360,
    "alt": "髪に両手を添えるみりぃ",
    "caption": "0:16:30｜髪に両手を添えるみりぃ",
    "downloadName": "mily-b179-04-20261001-night-001630.jpg"
  },
  {
    "src": "/media/live/mily-b179-05-20261001-night-002030.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラを見て微笑むみりぃ",
    "caption": "0:20:30｜カメラを見て微笑むみりぃ",
    "downloadName": "mily-b179-05-20261001-night-002030.jpg"
  },
  {
    "src": "/media/live/mily-b179-06-20261001-night-003030.jpg",
    "width": 640,
    "height": 360,
    "alt": "横を見ながら手を合わせるみりぃ",
    "caption": "0:30:30｜横を見ながら手を合わせるみりぃ",
    "downloadName": "mily-b179-06-20261001-night-003030.jpg"
  },
  {
    "src": "/media/live/mily-b179-07-20261001-night-004630.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔で手を上げるみりぃ",
    "caption": "0:46:30｜笑顔で手を上げるみりぃ",
    "downloadName": "mily-b179-07-20261001-night-004630.jpg"
  },
  {
    "src": "/media/live/mily-b179-08-20261001-night-005230.jpg",
    "width": 640,
    "height": 360,
    "alt": "目元へ指を添えるみりぃ",
    "caption": "0:52:30｜目元へ指を添えるみりぃ",
    "downloadName": "mily-b179-08-20261001-night-005230.jpg"
  },
  {
    "src": "/media/live/mily-b179-09-20261001-night-010030.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤に笑顔を見せるみりぃ",
    "caption": "1:00:30｜終盤に笑顔を見せるみりぃ",
    "downloadName": "mily-b179-09-20261001-night-010030.jpg"
  },
  {
    "src": "/media/live/mily-b179-10-20261001-night-010630.jpg",
    "width": 640,
    "height": 360,
    "alt": "髪へ手を添えて微笑むみりぃ",
    "caption": "1:06:30｜髪へ手を添えて微笑むみりぃ",
    "downloadName": "mily-b179-10-20261001-night-010630.jpg"
  }
];

export const streamRecap20261001Night: StreamRecap = {
  id: "2026-10-01-night-showroom",
  date: "2026-10-01",
  dateLabel: "2026.10.01（木）",
  theme: "夜の四次審査への準備",
  broadcastLabel: "22:31頃〜 約70分",
  platformLabel: "SHOWROOM",
  summary: "WEB投票の開始を前に、四次審査の応援についてみんなと確認しました。プロフィールから投票先へ進む手順を説明し、コメントに応えながらおしゃべり。審査への緊張と、みんなで楽しく頑張りたい気持ちを伝えました。",
  image: gallery[4],
  gallery,
  galleryNote: "夜配信の実フレームから、表情やしぐさの異なる10枚を選びました。時刻は録画先頭からの目安です。",
  highlights: [
    { timestamp: "0:00:13", title: "明日からの応援を一緒に", body: "翌日から始まるWEB投票を前に、来てくれたみんなへ呼びかけました。コメントに応えながら、応援の準備を話す夜の始まりです。" },
    { timestamp: "0:06:23", title: "分からないときは一緒に", body: "投票の仕方が分からない人には相談してほしいと案内。投票を確認しながら配信できたら、と話しました。" },
    { timestamp: "0:12:33", title: "審査を前にドキドキ", body: "WEB投票とSHOWROOM審査を前にした緊張に触れ、応援する側も同じようにドキドキするのかな、と問いかけました。" },
    { timestamp: "0:18:06", title: "プロフィールから投票先へ", body: "プロフィールのリンクから投票ページへ進む流れを説明しました。分からない人と、ゆっくり一緒に確認していこうと呼びかけます。" },
    { timestamp: "0:36:07", title: "投票を思い出す工夫", body: "投票を忘れないためのアラームの話から、みりぃの声で通知されたら、というアイデアへ。コメントとのやりとりがにぎやかに続きました。" },
    { timestamp: "0:40:43", title: "配信を始めた一歩", body: "配信を始めたころを振り返り、話しやすい話題があったことが一歩を踏み出すきっかけになったと話しました。出会ってくれたみんなに感謝を伝えます。" },
    { timestamp: "0:58:13", title: "みんなと楽しく頑張りたい", body: "四次審査への不安にも触れながら、これまで深めてきた絆や応援への感謝を話しました。みんなと楽しく審査を頑張りたいと呼びかけます。" },
  ],
  goals: [],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:00:13", label: "翌日からのWEB投票の話" },
    { timestamp: "0:06:23", label: "投票の操作を一緒に確認" },
    { timestamp: "0:12:33", label: "審査を前にした気持ち" },
    { timestamp: "0:18:06", label: "プロフィールと投票先の説明" },
    { timestamp: "0:22:41", label: "WEB投票とSHOWROOM審査の開始" },
    { timestamp: "0:36:07", label: "投票を忘れないための工夫" },
    { timestamp: "0:37:09", label: "昼配信から生まれた言葉" },
    { timestamp: "0:40:43", label: "配信を始めたころの振り返り" },
    { timestamp: "0:46:29", label: "投票を確認しながらの配信案" },
    { timestamp: "0:58:13", label: "四次審査へ向けた思い" },
    { timestamp: "1:03:47", label: "タイムテーブルの案内" },
    { timestamp: "1:05:29", label: "ランキングとお礼" },
    { timestamp: "1:08:34", label: "みんなと一緒に四次審査へ" },
  ],
  nextNote: "配信時点では、翌日の配信で投票を一緒に確認したいと話し、タイムテーブルも案内する予定だと伝えていました。",
  sourceLabel: "2026年10月1日 SHOWROOM夜配信（保存録画・自動文字起こし）",
  verifiedAt: "2026-10-02",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の録画から抽出した実フレーム10枚です。顔・身体の生成や補正は行っていません。",
    extra: "原音の手動聴取・逐語校正は未実施です。時刻は録画先頭からの目安です。歌唱曲は確定していません。短尺動画は原音の検品待ちのため掲載していません。",
  }),
};