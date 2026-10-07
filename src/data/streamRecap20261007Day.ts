import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

const gallery = [
  {
    src: "/media/live/mily-b195-01-20261007-noon-board.jpg",
    width: 640, height: 360,
    alt: "キラ星での応援をお願いするボードを見せるみりぃ",
    caption: "0:16:00｜手書きボードで応援を案内するみりぃ",
    downloadName: "mily-b195-01-20261007-noon-board.jpg",
  },
  {
    src: "/media/live/mily-b195-02-20261007-noon-slide.jpg",
    width: 640, height: 360,
    alt: "みりぃの写真とキラ星の応援案内を載せた配信内スライド",
    caption: "0:35:00｜配信内に表示されたキラ星の応援案内",
    downloadName: "mily-b195-02-20261007-noon-slide.jpg",
  },
];

export const streamRecap20261007Day: StreamRecap = {
  id: "2026-10-07-noon-showroom",
  date: "2026-10-07", dateLabel: "2026.10.07（水）",
  theme: "昼のキラ星応援ボード",
  broadcastLabel: "録画開始14:40頃〜 約42分", platformLabel: "SHOWROOM",
  summary: "手書きボードと応援スライドを、昼配信の実際のスクショ2枚で振り返ります。今回は画面で確認できた案内を中心にまとめています。",
  image: gallery[0], gallery,
  galleryNote: "当日の昼配信の実フレーム2枚です。ボードを見せる場面と配信内スライドを掲載しています。時刻は録画の先頭からの目安です。",
  highlights: [
    {
      timestamp: "0:16:00", title: "ボードで応援のお願い",
      body: "みりぃが見せた手書きボードには「キラ星 審査あり！」「ぜひ100キラで応援お願いします」の文字。頬に手を添え、画面へボードを向けた場面です。",
      relatedLinks: [{ label: "応援方法・投票先を確認", url: "/support/" }],
    },
    {
      timestamp: "0:35:00", title: "画面でもキラ星を案内",
      body: "配信内のスライドには「みんなのキラ星がとっても大事です!!」の文字。青い背景にキラ星での応援案内が大きく表示されています。",
    },
  ],
  goals: [], ranking: [], timeline: [], nextNote: "",
  sourceLabel: "2026年10月7日 昼のSHOWROOM配信（保存録画の実フレーム確認）",
  verifiedAt: "2026-10-08",
  transcriptionNote: buildTranscriptionNote({
    material: "保存録画の実フレームで確認できた画面の案内をまとめています。音声の確認・文字起こしは行っていません。",
    stills: "静止画は当日の昼配信の実フレーム2枚です。",
    extra: "本文のかぎ括弧は画面に書かれた文字で、本人の発話を引用したものではありません。審査条件や計算式は写真から推測せず、現在の応援案内をご確認ください。録画開始14:40頃・約42分は保存録画の目安で、配信全体の開始・終了を確定していません。会話の流れ・歌唱・ランキング・次枠の案内は未確認です。",
  }),
};
