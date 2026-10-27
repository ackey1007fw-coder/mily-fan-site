import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261025Night: StreamRecap = {
  id: "2026-10-25-night-showroom",
  date: "2026-10-25",
  dateLabel: "2026.10.25（日）",
  theme: "夜の色紙と感謝の時間",
  broadcastLabel: "録画開始23:00頃〜 約134分",
  platformLabel: "SHOWROOM",
  summary: "準備した色紙を紹介しながら、一人ひとりへの感謝とルームの思い出を振り返った夜。終盤には、皆で力を合わせてファイナルを目指したいという気持ちも伝えました。",
  image: { src: "/media/live/mily-b239-01-night-thanks-face-safe.jpg", width: 130, height: 200, alt: "10月25日夜のお礼配信のみりぃ", caption: "114:20頃の実フレームを顔中心にクロップした原寸130×200px。背景文字を除外。ASR位置と映像PTSの同期は未検証です。" },
  highlights: [
    { timestamp: "0:03:01", title: "色紙に込めたありがとう", body: "用意した色紙を紹介し、一人ひとりに感謝を届けるための工夫を話しました。" },
    { timestamp: "0:22:15", title: "作り方の話を交えたお礼", body: "色紙をどのように作ったかを話しながら、応援してくれた人たちへのお礼を続けました。" },
    { timestamp: "0:37:40", title: "コメントから広がる記憶", body: "コメントを通して相手を覚えられるという話題があり、ルームで重ねたやり取りを振り返りました。" },
    { timestamp: "1:54:10", title: "皆で力を合わせたい", relatedLinks: [{ label: "お礼配信の詳しい振り返り", url: "/data-lab/reports/20261025-night/#thank-you-report" }], body: "誰か一人に任せるのではなく、皆で力を合わせて進みたいという思いを伝えました。" },
    { timestamp: "1:55:48", title: "言葉にできた次の目標", body: "応援に支えられ、以前は口にできなかったファイナル進出の目標を、はっきり掲げられるようになったと話しました。" },
    { timestamp: "2:09:49", title: "遅い時間までの感謝", body: "遅くまで一緒に過ごしてくれた人たちを気遣い、改めてありがとうを伝えました。" },
  ],
  goals: [{ item: "コンテスト", target: "ファイナル進出", statusThen: "目標を言葉に" }],
  ranking: [],
  timeline: [],
  nextNote: "",
  sourceLabel: "2026年10月25日 夜のSHOWROOM配信（保存ASRの匿名化要約・録画メタデータ確認報告）",
  verifiedAt: "2026-10-27",
  transcriptionNote: buildTranscriptionNote({
    material: "保存された自動文字起こし全1,604レコードを分割して読んだ担当の匿名化要約に基づく、非逐語の暫定記録です。",
    stills: "静止画は同じ夜配信の実フレームから背景文字を除いた顔中心の非生成クロップ1枚を原寸130×200pxで掲載しています。",
    extra: "時刻はASRの経過秒数に基づく見返し目安で、映像PTSとの同期は未検証です。原音の手動聴取・逐語校正は未実施です。録画のコンテナ実尺は2時間13分52.742秒との確認報告がありますが、正式な配信開始・終了時刻や全編の無欠落を確認したものではありません。録画ログには通信エラーがあり、全編デコード検査は未実施です。歌唱の有無・曲名は未確定のため、歌唱リストを設けていません。数値はこのカードには掲載していません。",
  }),
};
