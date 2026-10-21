import { media231Gallery, media231Clip } from "./streamMedia2026102021.ts";
import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, buildRankingNote } from "./streamRecapRules.ts";

export const streamRecap20261020Asa: StreamRecap = {
  gallery: media231Gallery,
  image: media231Gallery[2],
  id: "2026-10-20-morning-showroom",
  date: "2026-10-20",
  dateLabel: "2026.10.20（火）",
  theme: "朝のアバターと挑戦",
  broadcastLabel: "録画開始5:52頃〜 約39分",
  platformLabel: "SHOWROOM",
  summary: "新しいアバターの話から始まり、セミファイナルへ向けた思いや、期待以上のものを届けたいという言葉へ。朝の応援に感謝し、今日も一緒に頑張ろうと送り出しました。",
  highlights: [
  {
    "timestamp": "0:02:20",
    "title": "初めての人へ自己紹介",
    "body": "初めて訪れた人に自己紹介し、アバターを受け取ったあとも配信を楽しんでほしいと呼びかけました。"
  },
  {
    "timestamp": "0:03:40",
    "title": "新しいアバターの話",
    "body": "配布が始まった新しいアバターを紹介。以前のアバターの思い出にも触れながら、身に着けてくれる人にお礼を伝えました。"
  },
  {
    "timestamp": "0:10:07",
    "title": "セミファイナルに向けて",
    "body": "次の審査への応援を呼びかけ、投票の大切さやSNSをフォローしてほしいという思いを話しました。"
  },
  {
    "timestamp": "0:14:30",
    "title": "後悔しない挑戦を",
    "body": "セミファイナルへ向け、できることに取り組みたいという決意を話しました。応援してくれる人へ、これからも見ていてほしいと伝えました。"
  },
  {
    "timestamp": "0:29:09",
    "title": "期待以上を届けたい",
    "body": "よい意味で期待を裏切り、期待以上のものを届けたいと話しました。初めての人にも、自分のことを覚えてほしいと呼びかけました。"
  },
  {
    "timestamp": "0:34:40",
    "title": "朝の応援へのお礼",
    "body": "ランキングを読み上げながら、朝早く来てくれたことや、きら星・コメントなどの応援に感謝を伝えました。"
  },
  {
    "timestamp": "0:37:52",
      clip: media231Clip,
    "title": "今日も一緒に頑張ろう",
    "body": "それぞれの一日にある小さな頑張りにも触れ、一緒に頑張ろうと送り出しました。最後まで手を振りながら挨拶しました。",
    relatedLinks: [{ label: "MILY SIGNAL・10月20日朝の観測と確認範囲", url: "/data-lab/reports/20261020-morning/" }]
  }
],
  goals: [],
  timeline: [
  {
    "timestamp": "0:02:20",
    "label": "初めての人へ自己紹介"
  },
  {
    "timestamp": "0:03:40",
    "label": "新しいアバターの話"
  },
  {
    "timestamp": "0:10:07",
    "label": "セミファイナルに向けて"
  },
  {
    "timestamp": "0:14:30",
    "label": "後悔しない挑戦を"
  },
  {
    "timestamp": "0:29:09",
    "label": "期待以上を届けたい"
  },
  {
    "timestamp": "0:34:40",
    "label": "朝の応援へのお礼"
  },
  {
    "timestamp": "0:37:52",
    "label": "今日も一緒に頑張ろう"
  }
],
  nextNote: "配信時点では、同日夕方にも配信できるかもしれないと話していました。時刻は確定していません。",
  sourceLabel: "2026年10月20日 朝のSHOWROOM配信（保存録画の実フレーム・速報自動文字起こし参照）",
  verifiedAt: "2026-10-20",
  ranking: [buildRankingNote(undefined, undefined, "during")],
  transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は同じ配信の実フレーム5枚を掲載しています。", publishedClips: true, extra: "オーナー承認のトーク短尺を追加。先頭0.3秒は同じ配信の表紙静止画で、原音と尺は保持しています。背景の紙にある文字だけをぼかしています。以下は全編記事の確認範囲です。保存メディア尺は約38分59秒。録画処理時刻と正式な配信時刻は別で、全区間の連続性は未検証です。自動文字起こし117処理区間を参照し、全編の手動聴取と逐語確認は行っていません。時刻は録画先頭からの目安です。短い歌唱の曲名は確定していません。数値は6:28:05の画面参考値まで確認できましたが、締めの挨拶はその後も続き、最終集計は未確認です。匿名の観測と収集範囲はデータラボへ掲載しています。"}),
};
