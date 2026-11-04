import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// b252 media are withheld pending complete sticky-note redaction and audio verification.
// The recording-relative text recap stays available; no replacement images are generated.
export const streamRecap1104Morning: StreamRecap = {
  id: "2026-11-04-morning-showroom",
  date: "2026-11-04",
  dateLabel: "2026.11.04（水）",
  theme: "朝のにゃんにゃんとパンク版",
  broadcastLabel: "6:41頃〜 約35分",
  platformLabel: "SHOWROOM",
  summary: "前髪がぱっくり割れたまま始まった朝枠。「頭が働いていない」と笑いながら、ねこの歌「にゃんにゃんにゃん」を歌い、初めての「パンクバージョン」も披露。お仕事に向かうみんなへ「エネルギーチャージになりますように」と送り出し、投票の残り日程を伝えて締めくくりました。",
  highlights: [
    { timestamp: "0:03:14", title: "デコ出し、似合う？", body: "前髪をセットしようとしたらぱっくり割れてしまったそうで、「デコ出しじゃないこれ」「デコ出し似合う？」と照れ笑い。" },
    { timestamp: "0:08:04", title: "今日は3枠", body: "この日は朝・昼・夜の3枠。昼は14時45分から、夜はいつもより早い20時50分からと、今日の配信予定を案内しました。" },
    { timestamp: "0:12:16", title: "頭が働いていない朝", body: "終了時刻を言い間違えたり、引き算に詰まったり。「頭が働いてないのバレバレだよね」と笑い、心配するみんなに「大丈夫だよ」と伝えました。" },
    { timestamp: "0:18:35", title: "朝からにゃんにゃんにゃん", body: "「じゃあにゃんにゃんやるか」と、ねこの歌「にゃんにゃんにゃん」を朝から歌唱。途中でお礼をはさみながら、2番の「おかえりにゃ、おやつくれ」まで歌いきり、「もうにゃんにゃん終わり」と照れました。" },
    { timestamp: "0:26:47", title: "パンクバージョン、初披露", body: "「パンクにゃんにゃんっていうのがあるんだよ」と予告していたパンクバージョンを披露。歌い終えて「パンクバージョンは初めてなんだけど、嬉しい！」と喜びました。" },
    { timestamp: "0:28:22", title: "みんなのエネルギーチャージに", body: "「みんな今日はお仕事？」と問いかけ、「みんなに元気を与えよう」「みんなのエネルギーチャージになりますように」と送り出しました。", quote: "みんなのエネルギーチャージになりますように" },
    { timestamp: "0:29:15", title: "投票は11月8日まで", body: "投票は11月8日まで、配信でのSHOWROOM審査は7日までと伝え、「皆さんどうか私に力を貸してください」とお願いしました。" },
    { timestamp: "0:31:56", title: "今日も一日よろしくね", body: "大きなレインボースターに喜び、「今日も一日よろしくね」「今日も頑張ろうね」とあいさつして朝枠を締めくくりました。" },
  ],
  goals: [],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:02", label: "朝のはじまり（コメントが見えないトラブル）" },
    { timestamp: "0:03:14", label: "前髪が割れてデコ出しに" },
    { timestamp: "0:08:04", label: "今日の配信予定（朝・昼・夜）" },
    { timestamp: "0:12:16", label: "頭が働いていない朝" },
    { timestamp: "0:16:10", label: "緊張すると何をしているか分からなくなる話" },
    { timestamp: "0:18:35", label: "にゃんにゃんにゃん" },
    { timestamp: "0:21:41", label: "もうにゃんにゃん終わり" },
    { timestamp: "0:24:55", label: "パンクにゃんにゃんの予告" },
    { timestamp: "0:26:47", label: "パンクバージョン初披露" },
    { timestamp: "0:28:22", label: "みんなのエネルギーチャージに" },
    { timestamp: "0:29:15", label: "投票は11月8日まで・SHOWROOM審査は7日まで" },
    { timestamp: "0:30:14", label: "ランキングの読み上げ" },
    { timestamp: "0:31:56", label: "締めのあいさつ" },
  ],
  nextNote: "配信時点では、この日の昼枠は14:45から、夜枠は20:50からと案内しました。",
  sourceLabel: "2026年11月4日 朝のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-04",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画・短尺動画は、背景の付箋の文字を再確認するため掲載を保留しています。",
    publishedClips: false,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は6:41頃の開始から終了までの約33分です。配信の正式な終了時刻は確認していません。再掲載前に、背景の文字と短尺原音の視聴者名・コメント読み上げを確認します。歌唱場面の動画は掲載していません。曲名は「にゃんにゃんにゃん」以外は扱っていないため、曲リストは作っていません。ランキングの読み上げは確認しましたが、個人名は掲載していません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
