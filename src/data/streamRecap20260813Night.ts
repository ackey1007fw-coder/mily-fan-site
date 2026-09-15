import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕1,683行を全文テキスト確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕の範囲で整理しています。";

export const streamRecap20260813Night: StreamRecap = {
  id: "2026-08-13-night-showroom",
  date: "2026-08-13",
  dateLabel: "2026.08.13（木）",
  theme: "深夜の雷とWEB投票7日目",
  broadcastLabel: "23:31頃〜 約89分",
  platformLabel: "SHOWROOM",
  summary:
    "雷の夜の深夜配信。アバター作りや髪型、雨と停電の話をしながら交流し、日付が変わるとWEB投票7日目を案内。終盤はしり取りで盛り上がり、翌朝11時30分の配信で久しぶりに歌いたいと予告して、ランキングと感謝で締めました。",
  highlights: [
    { timestamp: "0:00:08", title: "夜のサイドポニー", body: "髪型やアバターの話をしながら、深夜枠をゆるく始めました。" },
    { timestamp: "0:15:32", title: "雨のあと、そのまま配信へ", body: "雨に濡れて帰宅し、直前の番組を終えてそのまま配信していると話しました。" },
    { timestamp: "0:17:53", title: "翌朝11時30分を案内", body: "配信時点では、翌日の朝枠を11時30分から予定していると確認しました。" },
    { timestamp: "0:33:19", title: "雷と停電への備え", body: "強い雷を気にし、停電時の備えや安全について話しました。" },
    { timestamp: "0:37:51", title: "WEB投票7日目", body: "日付が変わったタイミングで、7日目のWEB投票を忘れないうちにお願いしました。" },
    { timestamp: "1:01:53", title: "みんなの力になれる配信へ", body: "応援への感謝を伝え、自分もみんなの力になれるよう頑張りたいと話しました。" },
    { timestamp: "1:21:51", title: "翌朝は久しぶりに歌いたい", body: "喉の調子が戻ってきたため、翌日の配信で歌える曲を少し歌いたいと予告しました。" },
    { timestamp: "1:28:00", title: "元気をもらった夜", body: "話せて元気になったと感謝し、ランキングを読み上げて配信を締めました。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:00:08", label: "髪型とアバターの話でスタート" },
    { timestamp: "0:04:43", label: "雨で髪が濡れた話" },
    { timestamp: "0:13:22", label: "お絵かき配信とアバター制作を振り返る" },
    { timestamp: "0:15:32", label: "雨の中帰宅し直前の番組から配信へ" },
    { timestamp: "0:17:53", label: "翌朝11時30分の予定を確認" },
    { timestamp: "0:33:19", label: "雷と停電への備えを話す" },
    { timestamp: "0:37:51", label: "日付変更後のWEB投票7日目を案内" },
    { timestamp: "0:45:55", label: "配信サムネや審査について雑談" },
    { timestamp: "1:01:53", label: "応援への感謝と配信で届けたいこと" },
    { timestamp: "1:21:51", label: "翌朝に歌を入れたいと予告" },
    { timestamp: "1:25:06", label: "しり取りをみんなで締める" },
    { timestamp: "1:28:00", label: "13位から1位までランキング読み上げ" },
    { timestamp: "1:29:15", label: "翌朝11時30分とWEB投票を再案内" },
  ],
  nextNote:
    "配信時点では、翌日の11時30分から配信し、喉の調子を見ながら久しぶりに歌いたいと案内していました。",
  sourceLabel: "2026年8月13日 SHOWROOM深夜配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は掲載していません。",
    extra:
      "録画タイトルの開始時刻は目安として扱っています。終盤に話題に出た曲名はリクエストや翌朝の候補で、この回の独立した歌唱としては確認できなかったためsongsには登録していません。",
  }),
};
